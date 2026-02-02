import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginDTO } from 'src/auth/dtos/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dtos/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: loginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    return {
      email,
      id: user.id,
      role: user.role,
      name: user.name,
      agentId: user.agentId || null,
    };
  }

  async login(
    id: number,
    email: string,
    role: string,
    name: string,
    agentId: number | undefined,
  ) {
    const payload = {
      id,
      email,
      name,
      role,
      agentId: agentId || undefined,
    };

    const tokens = await this.generateTokens(payload as PayloadDto);
    await this.updateRtHash(id, tokens.refreshToken);

    return tokens;
  }

  async refresh(
    id: number,
    email: string,
    role: string,
    name: string,
    agentId: number | undefined,
  ) {
    const tokens = await this.generateTokens({
      id,
      email,
      role,
      name,
      agentId,
    });
    await this.updateRtHash(id, tokens.refreshToken);

    return tokens;
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
