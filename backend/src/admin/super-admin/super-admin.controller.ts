import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgencyDto } from './dtos/createAgency.dto';
import { CreateAdminDto } from './dtos/createAdmin.dto';
import { UpdateAgencyDto } from './dtos/updateAgency.dto';
import * as bcrypt from 'bcrypt';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.SUPER_ADMIN)
@Controller('super-admin')
export class SuperAdminController {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // ---------- 1. Dashboard & Stats ----------
  // ==========================================

  @Get('stats')
  async getDashboardStats() {
    const [revenueData, totalAgencies, totalCars, totalRentals] =
      await Promise.all([
        this.prisma.rental.aggregate({
          _sum: { totalPrice: true },
          where: { status: { not: 'CANCELLED' } }, // حساب الفلوس الحقيقية بس
        }),
        this.prisma.agency.count(),
        this.prisma.car.count(),
        this.prisma.rental.count({
          where: { status: 'ACTIVE' }, // عدد الحجوزات الشغالة حالياً على المنصة
        }),
      ]);

    // جلب الداتا للـ Chart على مستوى المنصة كلها
    const rawRentals = await this.prisma.rental.findMany({
      where: {
        status: { in: ['ACTIVE', 'COMPLETED'] },
        startDate: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          lte: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      },
      select: { startDate: true, totalPrice: true },
    });

    // تجميع الإيرادات لكل يوم للمنصة
    const dailyRevenue = rawRentals.reduce((acc, rental) => {
      const dateKey = rental.startDate.toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + Number(rental.totalPrice || 0);
      return acc;
    }, {});

    const chartData = Object.keys(dailyRevenue)
      .sort()
      .map((date) => ({
        date,
        amount: dailyRevenue[date],
      }));

    return {
      totalRevenue: revenueData._sum.totalPrice || 0,
      totalAgencies,
      totalCars,
      totalRentals,
      chartData,
    };
  }

  // ==========================================
  // ---------- 2. Agencies Management --------
  // ==========================================

  @Get('agencies')
  async getAgencies() {
    return await this.prisma.agency.findMany({
      include: {
        _count: {
          select: { cars: true, members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('agencies')
  async createAgency(@Body() dto: CreateAgencyDto) {
    if (!dto.name) {
      throw new BadRequestException('Agency name is required');
    }

    return await this.prisma.agency.create({
      data: {
        name: dto.name,
        logo: dto.logo || 'https://placehold.co/100x100/png',
        isActive: true,
      },
    });
  }

  @Patch('agencies/:id')
  async updateAgency(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAgencyDto,
  ) {
    const agency = await this.prisma.agency.findUnique({
      where: { id },
    });

    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    return await this.prisma.agency.update({
      where: { id },
      data: { ...dto },
    });
  }

  @Delete('agencies/:id')
  async deleteAgency(@Param('id', ParseIntPipe) id: number) {
    const agency = await this.prisma.agency.findUnique({
      where: { id },
    });

    if (!agency) {
      throw new NotFoundException('Agency not found');
    }

    await this.prisma.agency.delete({
      where: { id },
    });

    return { message: 'Agency deleted successfully' };
  }

  // ==========================================
  // ---------- 3. Users Management -----------
  // ==========================================

  @Post('users/admin')
  async createAgencyAdmin(@Body() dto: CreateAdminDto) {
    const agency = await this.prisma.agency.findUnique({
      where: { id: dto.agencyId },
    });

    if (!agency) {
      throw new NotFoundException('Target Agency not found');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const defaultPasswordHash = await bcrypt.hash('123123', 10);

    const newAdmin = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: defaultPasswordHash,
        role: 'ADMIN',
        agencyId: dto.agencyId,
        isVerified: true,
      },
    });

    const { password, ...result } = newAdmin;
    return {
      message: 'Agency Admin created successfully',
      admin: result,
    };
  }

  // جلب كل مديري الشركات (عشان تقدر تتابعهم وتشوف تبع أنهي شركة)
  @Get('users/admins')
  async getAllAdmins() {
    return await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      include: { agency: { select: { name: true } } }, // بنجيب اسم الشركة معاهم
      orderBy: { createdAt: 'desc' },
    });
  }

  // جلب كل العملاء العاديين (عشان الـ Super Admin يشوف قاعدة بيانات العملاء)
  @Get('users/customers')
  async getAllCustomers() {
    return await this.prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        _count: { select: { rentals: true } }, // عشان تعرف كل عميل أجر كام مرة
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // تفعيل/إيقاف أي يوزر (Ban / Deactivate) سواء كان عميل أو أدمن
  @Patch('users/:id/status')
  async toggleUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot modify Super Admin status');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive }, // تأكد إن حقل isActive موجود في الـ Prisma Schema عندك
    });

    return {
      message: `User status updated to ${isActive ? 'Active' : 'Inactive'}`,
    };
  }

  // ==========================================
  // -------- 4. Global Moderation ------------
  // ==========================================

  // الإشراف على كل العربيات في المنصة
  @Get('cars')
  async getAllPlatformCars() {
    return await this.prisma.car.findMany({
      include: {
        agency: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // الإشراف على كل الحجوزات في المنصة
  @Get('rentals')
  async getAllPlatformRentals() {
    return await this.prisma.rental.findMany({
      include: {
        car: { include: { agency: { select: { name: true } } } },
        customer: { select: { name: true, email: true, phoneNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
