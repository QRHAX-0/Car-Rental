import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma/enums';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as {
      id: number;
      email: string;
      name: string;
      role: Role;
      agentId: number;
    };
    const tokens = await this.authService.login(
      user.id,
      user.email,
      user.role,
      user.name,
      user.agentId,
    );

    this.setCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        agentId: user.agentId,
      },
    };
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as {
      id: number;
      email: string;
      name: string;
      role: string;
      agentId: number;
    };

    const tokens = await this.authService.refresh(
      user.id,
      user.email,
      user.name,
      user.role,
      user.agentId,
    );

    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Refresh successful' };
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as { id: number };

    console.log(req.user);
    const getUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        agentId: true,
      },
    });
    return getUser;
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
