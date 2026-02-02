import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarDataDTO } from './dtos/car.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import type { Request } from 'express';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'generated/prisma/enums';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  // -------------- Normal User Routes --------------
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get('')
  async getAllCars() {
    return await this.carsService.findAll();
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get(':id')
  async getCarById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    console.log(req.user as any);

    return await this.carsService.findCarById(id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get('agent/:agentId')
  async getCarsByAgent(
    @Req() req: Request,
    @Param('agentId', ParseIntPipe) agentId: number,
  ) {
    const user = req.user as { agentId: number };
    console.log(user);

    return await this.carsService.findCarsByAgent(agentId);
  }
  // -------------- Admin & Super Admin Routes --------------

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('add-car')
  async createCar(@Body() carData: CarDataDTO, @Req() req: Request) {
    const user = req.user as {
      name: string;
      email: string;
      role: string;
      agentId: number;
    };

    let finalAgentId: number;

    if (user.agentId) {
      finalAgentId = user.agentId;
    } else {
      if (!carData.agentId) {
        throw new BadRequestException('Super Admin must specify an agentId');
      }
      finalAgentId = carData.agentId;
    }
    console.log('Logged in user:', req.user);

    return await this.carsService.create(carData, finalAgentId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':carId/edit')
  async editCar(
    @Param('carId', ParseIntPipe) carId: number,
    @Body() carData: CarDataDTO,
    @Req() req: Request,
  ) {
    const user = req.user as { agentId: number };

    // const finalAgentId = user.agentId ? user.agentId : undefined;

    return await this.carsService.update(carId, carData, user.agentId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':carId/delete')
  async removeCar(
    @Param('carId', ParseIntPipe) carId: number,
    @Req() req: Request,
  ) {
    const user = req.user as { agentId: number };
    return await this.carsService.remove(carId, user.agentId);
  }
}
