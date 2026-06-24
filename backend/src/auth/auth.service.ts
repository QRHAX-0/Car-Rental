import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dtos/payload.dto';
import { registerDTO } from './dtos/register.dto';
import { Role } from '@prisma/client';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(reqUser: {
    googleId: string;
    email: string;
    name: string;
    role: Role;
    image: string;
  }) {
    if (!reqUser) throw new UnauthorizedException('No user from google');

    let user = await this.prisma.user.findUnique({
      where: { email: reqUser.email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: reqUser.email,
          name: reqUser.name,
          googleId: reqUser.googleId,
          role: reqUser.role,
          image: reqUser.image,
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { email: user.email },
        data: { googleId: reqUser.googleId },
      });
    }

    const payload: PayloadDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      agencyId: user.agencyId || undefined,
    };

    const tokens = await this.generateTokens(payload);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(
    { name, email, password, phoneNumber }: registerDTO,
    imageFile: Express.Multer.File | null,
  ) {
    const imagePath = imageFile?.path || null;

    const userExist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userExist) throw new ConflictException('Email is already in use');

    const hashPass = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashPass,
        image: imagePath,
        role: 'USER',
      },
    });

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      agencyId: user.agencyId || undefined,
    });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (!user.password)
      throw new UnauthorizedException('Invalid email or password');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Invalid email or password');

    return {
      email,
      id: user.id,
      role: user.role,
      name: user.name,
      agencyId: user.agencyId || undefined,
    };
  }

  async login(user: PayloadDto) {
    const tokens = await this.generateTokens(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // بنرجع رسالة نجاح وهمية لدواعي الأمان عشان الهاكرز ميعرفوش الإيميلات المسجلة
      return {
        message: 'If this email is registered, a reset link has been sent.',
      };
    }

    // 1. توليد رمز عشوائي
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // 2. تحديد وقت الانتهاء (15 دقيقة من دلوقتي)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    // 3. حفظ الرمز في الداتا بيز
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedResetToken,
        resetPasswordExpires: expires,
      },
    });

    // 4. إعداد الـ Transporter بتاع الإيميل (هتحتاج تحط بياناتك الحقيقية هنا لاحقاً)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // أو أي خدمة تانية
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${email}`;

    await transporter.sendMail({
      from: '"LUXE Rental" <noreply@luxerental.com>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h3>Hello ${user.name},</h3>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link is valid for 15 minutes. If you didn't request this, please ignore this email.</p>
      `,
    });

    return {
      message: 'If this email is registered, a reset link has been sent.',
    };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (new Date() > user.resetPasswordExpires) {
      throw new UnauthorizedException('Reset token has expired');
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid reset token');
    }

    const hashPass = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPass,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Password reset successful. You can now login.' };
  }

  async refresh(user: PayloadDto) {
    const tokens = await this.generateTokens(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    return true;
  }

  async generateTokens(
    payload: PayloadDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(
      { ...payload },
      {
        secret: process.env.ACCESSSECRET || '',
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...payload },
      {
        secret: process.env.REFRESHSECRET || '',
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async updateRtHash(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async updateProfile(userId: number, data: UpdateProfileDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        agencyId: true,
        phoneNumber: true,
      },
    });

    return updatedUser;
  }
}
