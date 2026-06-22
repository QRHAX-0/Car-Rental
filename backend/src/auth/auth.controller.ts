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
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshGuard } from './guards/refresh.guard';
import { registerDTO } from './dtos/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/common/utils/file-upload.utils';
import { GoogleGuard } from './guards/google.guard';
import { PayloadDto } from './dtos/payload.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.googleLogin(
      req.user,
    );
    this.setCookies(res, accessToken, refreshToken);
    return res.redirect('http://localhost:5174/');
  }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storageConfig('users'),
    }),
  )
  async register(
    @Body() data: registerDTO,
    @UploadedFile() file: Express.Multer.File | null,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(data, file);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'User registered successfully' };
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as PayloadDto;

    const { accessToken, refreshToken } = await this.authService.login(user);

    this.setCookies(res, accessToken, refreshToken);
    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.authService.resetPassword(email, token, newPassword);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as PayloadDto;

    const tokens = await this.authService.refresh(user);

    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { message: 'Refresh successful' };
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as PayloadDto;

    await this.authService.logout(user.id);

    this.removeCookies(res);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as PayloadDto;

    const getUser = await this.prisma.user.findUnique({
      where: { id: user.id },
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
    return getUser;
  }

  @UseGuards(JwtGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = req.user as PayloadDto;
    return await this.authService.updateProfile(user.id, updateProfileDto);
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

  private removeCookies(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });
  }
}
