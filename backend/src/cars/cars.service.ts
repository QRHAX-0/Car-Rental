import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from 'generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';
import { CarDataDTO } from './dtos/car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(carData: CarDataDTO, agentId: number) {
    const { agentId: ignoredId, ...carDataWithoutAgentId } = carData;
    const newCar: Car = await this.prisma.car.create({
      data: {
        ...carDataWithoutAgentId,
        agent: { connect: { id: agentId } },
      },
    });
    return newCar;
  }

  async remove(carId: number, agentId?: number) {
    const car = await this.prisma.car.findFirst({
      where: {
        id: carId,
        ...((agentId && { agentId: agentId }) || undefined),
      },
    });
    if (!car) throw new NotFoundException('Car not found or access denied');
    await this.prisma.car.delete({ where: { id: carId } });
    return { message: 'Car removed successfully' };
  }

  async update(
    carId: number,
    carData: Partial<CarDataDTO>,
    agentId?: number,
  ): Promise<Car> {
    const car = await this.prisma.car.findFirst({
      where: {
        id: carId,
        ...((agentId && { agentId: agentId }) || undefined),
      },
    });
    if (!car) throw new NotFoundException('Car not found or access denied');
    const { agentId: ignoredId, ...carDataWithoutAgentId } = carData;
    const updatedCar = await this.prisma.car.update({
      where: { id: carId },
      data: { ...carDataWithoutAgentId },
    });
    return updatedCar;
  }

  async findAll(): Promise<Car[]> {
    return await this.prisma.car.findMany({ where: { isAvailable: true } });
  }

  async findCarById(carId: number): Promise<Car | null> {
    return await this.prisma.car.findUnique({ where: { id: carId } });
  }

  async findCarsByAgent(agentId: number): Promise<Car[]> {
    return await this.prisma.car.findMany({
      where: { agentId },
    });
  }
}
