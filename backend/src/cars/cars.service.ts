import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CarDataDTO } from './dtos/car.dto';
import { Car } from 'generated/prisma/client';
import { UpdateCarDataDTO } from './dtos/updateCar.dto';
import path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    carData: CarDataDTO,
    imageFiles: Array<Express.Multer.File>,
    agencyId: number,
  ) {
    const imageData = imageFiles.map((file) => ({
      image: file.path,
    }));

    const { agencyId: ignoredId, ...carDataWithoutAgentId } = carData;
    const newCar: Car = await this.prisma.car.create({
      data: {
        ...carDataWithoutAgentId,
        images: { create: imageData },
        agency: { connect: { id: agencyId } },
      },
      include: {
        images: true,
      },
    });
    return newCar;
  }

  async remove(carId: number, agencyId?: number) {
    const car = await this.prisma.car.findFirst({
      where: {
        id: carId,
        ...((agencyId && { agencyId: agencyId }) || undefined),
      },
    });
    if (!car) throw new NotFoundException('Car not found or access denied');

    await this.prisma.car.delete({ where: { id: carId } });
    return { message: 'Car removed successfully' };
  }

  async update(
    carId: number,
    carData: UpdateCarDataDTO,
    imageFiles?: Array<Express.Multer.File>,
    agencyId?: number,
  ): Promise<Car> {
    const imageDatas =
      imageFiles?.map((file) => ({
        image: file.path,
      })) || [];

    const car = await this.prisma.car.findFirst({
      where: {
        id: carId,
        ...((agencyId && { agencyId: agencyId }) || undefined),
      },
    });
    if (!car) throw new NotFoundException('Car not found or access denied');

    const { agencyId: ignoredId, ...carDataWithoutAgencyId } = carData;

    const updatedCar = await this.prisma.car.update({
      where: { id: carId },
      data: {
        ...carDataWithoutAgencyId,

        ...(imageFiles && {
          images: { create: imageDatas },
        }),
      },
    });
    return updatedCar;
  }

  async deleteCarImage(carId: number, imageId: number) {
    const imageRecord = await this.prisma.carImages.findFirst({
      where: { id: imageId, carId },
    });

    if (!imageRecord) {
      throw new NotFoundException('Image not found');
    }

    await this.prisma.carImages.delete({
      where: { id: imageId },
    });

    try {
      const filePath = path.join(process.cwd(), imageRecord.image);
      await fs.unlink(filePath);
    } catch (error) {
      console.error(
        `Failed to delete physical file for image ID ${imageId}:`,
        error.message,
      );
    }

    return { message: 'Image successfully deleted' };
  }

  async findAll(): Promise<Car[]> {
    return await this.prisma.car.findMany({ where: { isAvailable: true } });
  }

  async findCarById(carId: number): Promise<Car | null> {
    return await this.prisma.car.findUnique({
      where: { id: carId },
      include: { images: true },
    });
  }

  async findCarsByAgency(agencyId: number): Promise<Car[]> {
    return await this.prisma.car.findMany({
      where: { agencyId },
    });
  }
}
