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
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarDataDTO } from './dtos/car.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import type { Request } from 'express';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { CarCategory, Role } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../common/utils/file-upload.utils';
import { UpdateCarDataDTO } from './dtos/updateCar.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  // -------------- Public Routes --------------

  @Get('')
  async getAllCars(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('category') category?: CarCategory,
  ) {
    return await this.carsService.findAll(
      limit ? +limit : 6,
      page ? +page : 1,
      category,
    );
  }

  @Get(':id')
  async getCarById(@Param('id', ParseIntPipe) id: number) {
    return await this.carsService.findCarById(id);
  }

  @Get('agency/:agencyId')
  async getCarsByAgent(@Param('agencyId', ParseIntPipe) agencyId: number) {
    return await this.carsService.findCarsByAgency(agencyId);
  }

  // -------------- Protected Routes --------------

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('add-car')
  @UseInterceptors(
    FilesInterceptor('image', 5, {
      storage: storageConfig('cars'),
    }),
  )
  async createCar(
    @Body() carData: CarDataDTO,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    const user = req.user as { agencyId: number };

    let finalAgencyId: number;

    if (user.agencyId) {
      finalAgencyId = user.agencyId;
    } else {
      if (!carData.agencyId) {
        throw new BadRequestException('Super Admin must specify an agencyId');
      }
      finalAgencyId = carData.agencyId;
    }

    return await this.carsService.create(carData, files, finalAgencyId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':carId/edit')
  @UseInterceptors(
    FilesInterceptor('image', 5, {
      storage: storageConfig('cars'),
    }),
  )
  async editCar(
    @Param('carId', ParseIntPipe) carId: number,
    @Body() carData: UpdateCarDataDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    const user = req.user as { agencyId: number };
    const finalagencyId = user.agencyId ? user.agencyId : undefined;

    return await this.carsService.update(carId, carData, files, finalagencyId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':carId/delete')
  async removeCar(
    @Param('carId', ParseIntPipe) carId: number,
    @Req() req: Request,
  ) {
    const user = req.user as { agencyId: number };

    const finalagencyId = user.agencyId ? user.agencyId : undefined;

    return await this.carsService.remove(carId, finalagencyId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':carId/images/:imageId')
  async deleteCarImage(
    @Param('carId', ParseIntPipe) carId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return await this.carsService.deleteCarImage(carId, imageId);
  }
}
