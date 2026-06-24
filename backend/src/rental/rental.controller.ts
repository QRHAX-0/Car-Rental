import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../common/decorators/role.decorator';
import type { Request } from 'express';
import { CreateRent } from './dtos/createRental';
import { PickupRentalDto } from './dtos/pickupRental.dto';
import { ActiveUser } from '../common/interfaces/active-user.interface';
import { ReturnRentalDto } from './dtos/returnRental.dto';
import { searchCarsDTO } from './dtos/searchcars.dto';
import { RoleGuard } from '../common/guards/role.guard';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles('USER')
  @Get('my-bookings')
  async getMyBookings(@Req() req: Request) {
    const user = req.user as ActiveUser;
    return this.rentalService.getMyBookings(user.id);
  }

  @UseGuards(JwtGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'AGENT', 'USER')
  @Get(':id')
  async getBookingById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as ActiveUser;
    return await this.rentalService.getBookingById(id, user.id, user.role);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles('USER')
  @Post('book')
  async createRental(@Body() data: CreateRent, @Req() req: Request) {
    const user = req.user as { id: number };
    return await this.rentalService.createRent(data, user.id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'AGENT')
  @Patch(':id/pickup')
  async pickupCar(
    @Body() PickupRentalData: PickupRentalDto,
    @Param('id', ParseIntPipe) rentalId: number,
    @Req() req: Request,
  ) {
    const user = req.user as ActiveUser;
    return await this.rentalService.pickupCar(rentalId, user, PickupRentalData);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'AGENT')
  @Patch(':id/return')
  async returnCar(
    @Body() ReturnRentalData: ReturnRentalDto,
    @Param('id', ParseIntPipe) rentalId: number,
    @Req() req: Request,
  ) {
    const user = req.user as ActiveUser;
    return await this.rentalService.returnRental(
      rentalId,
      user,
      ReturnRentalData,
    );
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'AGENT', 'USER')
  @Patch(':id/cancel')
  async cancelCar(
    @Param('id', ParseIntPipe) rentalId: number,
    @Req() req: Request,
  ) {
    const user = req.user as ActiveUser;
    return await this.rentalService.cancelRental(rentalId, user);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(200)
  @Post('search')
  async searchCars(@Body() { searchStartDate, searchEndDate }: searchCarsDTO) {
    return await this.rentalService.searchCars({
      searchStartDate,
      searchEndDate,
    });
  }
}
