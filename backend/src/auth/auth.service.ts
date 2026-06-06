import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dtos/payload.dto';
import { registerDTO } from './dtos/register.dto';
import { Role } from 'generated/prisma/enums';

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
}
