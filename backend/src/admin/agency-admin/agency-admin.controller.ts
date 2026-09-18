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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentDto } from './dtos/createAgent.dto';
import * as bcrypt from 'bcrypt';
import { CarsService } from 'src/cars/cars.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarDataDTO } from 'src/cars/dtos/car.dto';
import { UpdateCarDataDTO } from 'src/cars/dtos/updateCar.dto';
import { RentalService } from 'src/rental/rental.service';
import { PickupRentalDto } from 'src/rental/dtos/pickupRental.dto';
import { ReturnRentalDto } from 'src/rental/dtos/returnRental.dto';
import { ActiveUser } from 'src/common/interfaces/active-user.interface';
import { CreateRent } from 'src/rental/dtos/createRental';
import { UpdateAgentDto } from './dtos/updateAgent.dto';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN, Role.AGENT)
@Controller('agency-admin')
export class AgencyAdminController {
  constructor(
    private prisma: PrismaService,
    private carsService: CarsService,
    private rentalService: RentalService,
  ) {}
  @Get('stats')
  async getAgencyStats(@Req() req) {
    const agencyId = req.user.agencyId;

    const [revenueData, totalCars, totalRentals, totalAgents] =
      await Promise.all([
        this.prisma.rental.aggregate({
          _sum: { totalPrice: true },
          where: {
            car: { agencyId },
            status: { not: 'CANCELLED' }, // بنتجاهل الحجوزات الملغية
          },
        }),
        this.prisma.car.count({ where: { agencyId } }),
        this.prisma.rental.count({
          where: { car: { agencyId }, status: 'ACTIVE' },
        }),
        this.prisma.user.count({ where: { agencyId, role: 'AGENT' } }),
      ]);

    // هنجيب كل الحجوزات اللي شغالة أو خلصت في آخر 7 أيام لحد 7 أيام قدام
    const rawRentals = await this.prisma.rental.findMany({
      where: {
        car: { agencyId },
        status: { in: ['ACTIVE', 'COMPLETED'] },
        startDate: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          lte: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      },
      select: { startDate: true, totalPrice: true },
    });

    // تجميع الإيرادات لكل يوم بشكل سليم
    const dailyRevenue = rawRentals.reduce((acc, rental) => {
      const dateKey = rental.startDate.toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + Number(rental.totalPrice || 0);
      return acc;
    }, {});

    // تحويل الداتا لـ Array وترتيبها تصاعدياً عشان الـ Chart تترسم صح
    const chartData = Object.keys(dailyRevenue)
      .sort()
      .map((date) => ({
        date,
        amount: dailyRevenue[date],
      }));

    return {
      totalRevenue: revenueData._sum.totalPrice || 0,
      totalCars,
      totalRentals,
      totalAgents,
      chartData,
    };
  }

  private checkAdminOnly(user: any) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can perform this action');
    }
  }

  // 2. جلب كل الموظفين (AGENTS) بتوع الشركة
  @Get('staff')
  async getAgencyStaff(@Req() req) {
    const agencyId = req.user.agencyId;
    this.checkAdminOnly(req.user); // 👈 إضافة الحماية هنا
    return await this.prisma.user.findMany({
      where: {
        agencyId,
        role: 'AGENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  // 3. إنشاء حساب لموظف جديد (AGENT)
  @Post('staff')
  async createAgent(@Req() req, @Body() dto: CreateAgentDto) {
    const agencyId = req.user.agencyId;
    this.checkAdminOnly(req.user); // 👈 إضافة الحماية هنا
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const defaultPasswordHash = await bcrypt.hash(dto.password, 10);

    const newAgent = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: defaultPasswordHash,
        role: 'AGENT',
        agencyId: agencyId,
        isVerified: true,
      },
    });

    const { password, ...result } = newAgent;
    return {
      message: 'Agent created successfully',
      agent: result,
    };
  }

  // 4. تعديل بيانات موظف (PATCH)
  @Patch('staff/:id')
  async updateAgent(
    @Req() req,
    @Param('id', ParseIntPipe) agentId: number,
    @Body() dto: UpdateAgentDto, // 👈 استخدمنا الـ DTO الجديد
  ) {
    const agencyId = req.user.agencyId;
    this.checkAdminOnly(req.user); // 👈 إضافة الحماية هنا
    // 1. التأكد إن الموظف ده موجود وتبع الشركة بتاعة الأدمن اللي بيعمل ريكويست
    const existingAgent = await this.prisma.user.findFirst({
      where: { id: agentId, agencyId: agencyId },
    });

    if (!existingAgent) {
      throw new NotFoundException(
        'Employee not found or does not belong to your agency',
      );
    }

    // 2. تجهيز البيانات اللي هتتعدل
    const updateData: any = { ...dto };

    // 3. التريكة بتاعة الباسورد: لو مبعوت، نشفره.. لو مش مبعوت، نمسحه من الـ Object عشان ميبوظش القديم
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    } else {
      delete updateData.password;
    }

    // 4. تنفيذ التعديل في الداتا بيز
    const updatedAgent = await this.prisma.user.update({
      where: { id: agentId },
      data: updateData,
    });

    const { password, ...result } = updatedAgent;
    return {
      message: 'Employee updated successfully',
      agent: result,
    };
  }

  // 5. حذف موظف (DELETE)
  @Delete('staff/:id')
  async deleteAgent(@Req() req, @Param('id', ParseIntPipe) agentId: number) {
    const agencyId = req.user.agencyId;
    this.checkAdminOnly(req.user); // 👈 إضافة الحماية هنا
    // التأكد إن الموظف تبع نفس الشركة قبل الحذف كنوع من الحماية (Security)
    const existingAgent = await this.prisma.user.findFirst({
      where: { id: agentId, agencyId: agencyId },
    });

    if (!existingAgent) {
      throw new NotFoundException(
        'Employee not found or does not belong to your agency',
      );
    }

    // يفضل قبل ما تمسح الموظف، تتأكد إنه مفيش عمليات متعلقة بيه (زي إنه يكون ماسك تسليم عربية دلوقتي)
    // بس مؤقتاً هنمسحه علطول:
    await this.prisma.user.delete({
      where: { id: agentId },
    });

    return {
      message: 'Employee deleted successfully',
    };
  }
  // ==========================================
  // ---------- Fleet Management (Cars) ---------
  // ==========================================

  // 1. جلب كل عربيات الشركة
  @Get('cars')
  async getAgencyCars(@Req() req) {
    const agencyId = req.user.agencyId;
    return await this.carsService.findCarsByAgency(agencyId);
  }

  // 2. إضافة عربية جديدة للشركة
  @Post('cars')
  @UseInterceptors(FilesInterceptor('images', 5, { dest: './uploads' }))
  async createAgencyCar(
    @Req() req,
    @Body() carData: CarDataDTO,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const agencyId = req.user.agencyId;
    return await this.carsService.create(carData, images || [], agencyId);
  }

  // 3. تعديل بيانات عربية
  @Patch('cars/:id')
  @UseInterceptors(FilesInterceptor('images', 5))
  async updateAgencyCar(
    @Req() req,
    @Param('id', ParseIntPipe) carId: number,
    @Body() updateData: UpdateCarDataDTO,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const agencyId = req.user.agencyId;
    return await this.carsService.update(
      carId,
      updateData,
      images || [],
      agencyId,
    );
  }

  // 4. حذف عربية بالكامل
  @Delete('cars/:id')
  async deleteAgencyCar(@Req() req, @Param('id', ParseIntPipe) carId: number) {
    const agencyId = req.user.agencyId;
    return await this.carsService.remove(carId, agencyId);
  }

  // 5. حذف صورة معينة من عربية
  @Delete('cars/:carId/images/:imageId')
  async deleteCarImage(
    @Req() req,
    @Param('carId', ParseIntPipe) carId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    const agencyId = req.user.agencyId;

    const car = await this.prisma.car.findFirst({
      where: { id: carId, agencyId: agencyId },
    });

    if (!car) {
      throw new ForbiddenException('Access denied to this car');
    }

    return await this.carsService.deleteCarImage(carId, imageId);
  }

  // ==========================================
  // -------- Rentals & Bookings Management ---
  // ==========================================

  // 5. إنشاء حجز يدوي نيابة عن العميل (Walk-in / Phone booking)
  @Post('rentals')
  async createManualRental(
    @Req() req,
    @Body() dto: CreateRent,
    @Body('customerId', ParseIntPipe) customerId: number,
  ) {
    // 1. حماية: نتأكد إن العربية اللي الموظف بيحجزها تخص شركته فعلاً
    const car = await this.prisma.car.findUnique({
      where: { id: dto.carId },
      select: { agencyId: true },
    });

    if (!car || car.agencyId !== req.user.agencyId) {
      throw new ForbiddenException(
        'You can only book cars belonging to your agency',
      );
    }

    // 2. لو تمام، نبعت البيانات للـ Service تكريت الحجز عادي جداً
    return await this.rentalService.createRent(dto, customerId, true);
  }
  // 1. جلب كل الحجوزات الخاصة بشركة الأدمن
  @Get('rentals')
  async getAgencyRentals(@Req() req) {
    const agencyId = req.user.agencyId;
    return await this.rentalService.getAgencyBookings(agencyId);
  }

  // 2. تسليم العربية للعميل (تغيير الحالة من PENDING إلى ACTIVE)
  @Patch('rentals/:id/pickup')
  async pickupCar(
    @Req() req,
    @Param('id', ParseIntPipe) rentalId: number,
    @Body() dto: PickupRentalDto,
  ) {
    // بمرر req.user بالكامل لأن الـ Service عندك متوقعة type اسمه ActiveUser
    return await this.rentalService.pickupCar(rentalId, req.user, dto);
  }

  // 3. استلام العربية من العميل (تغيير الحالة من ACTIVE إلى COMPLETED مع حساب الفلوس)
  @Patch('rentals/:id/return')
  async returnCar(
    @Req() req,
    @Param('id', ParseIntPipe) rentalId: number,
    @Body() dto: ReturnRentalDto,
  ) {
    return await this.rentalService.returnRental(rentalId, req.user, dto);
  }

  // 4. إلغاء الحجز (تغيير الحالة إلى CANCELLED)
  @Patch('rentals/:id/cancel')
  async cancelRental(@Req() req, @Param('id', ParseIntPipe) rentalId: number) {
    return await this.rentalService.cancelRental(rentalId, req.user);
  }
}
