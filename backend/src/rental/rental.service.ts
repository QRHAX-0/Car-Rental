import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRent } from './dtos/createRental';
import { PickupRentalDto } from './dtos/pickupRental.dto';
import { ActiveUser } from '../common/interfaces/active-user.interface';
import { ReturnRentalDto } from './dtos/returnRental.dto';
import { searchCarsDTO } from './dtos/searchcars.dto';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async createRent(
    { carId, startDate, endDate, notes }: CreateRent,
    customerId: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
      select: { isVerified: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new ForbiddenException(
        'Your account is not verified. Please verify your account to proceed with booking.',
      );
    }

    if (startDate >= endDate)
      throw new BadRequestException('End date must be after start date');

    const car = await this.prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) throw new NotFoundException('Car not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new BadRequestException('Cannot book a car in the past');
    }

    const isAvailable = await this.checkAvailability({
      carId,
      startDate,
      endDate,
    });

    if (!isAvailable)
      throw new ConflictException(
        'Car is explicitly unavailable for these dates',
      );

    const days = Math.max(
      1,
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    const totalPrice = days * +car.pricePerDay;

    return await this.prisma.rental.create({
      data: {
        startDate,
        endDate,
        status: 'PENDING',
        totalPrice,
        notes,
        customer: { connect: { id: customerId } },
        car: { connect: { id: carId } },
      },
    });
  }

  async pickupCar(
    rentalId: number,
    user: ActiveUser,
    { currentMileage, fuelLevel }: PickupRentalDto,
  ) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { car: true },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    if (rental.status !== 'PENDING')
      throw new BadRequestException('Rental is not in pending state');

    this.validateAgencyOwnership(rental.car.agencyId, user);

    return this.prisma.rental.update({
      where: { id: rentalId },
      data: {
        startMileage: currentMileage,
        pickupFuel: fuelLevel,
        pickupStaffId: user.id,
        status: 'ACTIVE',
      },
    });
  }

  async checkAvailability({ carId, startDate, endDate }: CreateRent) {
    const conflictingRental = await this.prisma.rental.findFirst({
      where: {
        carId,
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
        status: { not: 'CANCELLED' },
      },
    });

    return !conflictingRental;
  }

  async returnRental(
    rentalId: number,
    user: ActiveUser,
    { endMileage, fuelLevel, notes, additionalCharges }: ReturnRentalDto,
  ) {
    const rental = await this.prisma.rental.findFirst({
      where: { id: rentalId },
      include: { car: true },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    if (rental.status !== 'ACTIVE')
      throw new BadRequestException('Rental is not in active state');

    this.validateAgencyOwnership(rental.car.agencyId, user);

    const now = new Date();
    const daysToCharge = Math.abs(
      Math.max(
        1,
        Math.ceil(
          (now.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
      ),
    );

    let finalPrice = daysToCharge * +rental.car.pricePerDay;

    if (additionalCharges) finalPrice += additionalCharges;

    return this.prisma.rental.update({
      where: { id: rentalId },
      data: {
        status: 'COMPLETED',
        returnStaffId: user.id,
        totalPrice: finalPrice,
        endMileage,
        returnFuel: fuelLevel,
        notes,
        returnedAt: now,
        extraCharges: additionalCharges,
      },
    });
  }

  private validateAgencyOwnership(carAgencyId: number, user: ActiveUser) {
    if (!user.agencyId) return;

    if (carAgencyId != user.agencyId)
      throw new ForbiddenException(
        'You are not authorized to process this rental',
      );
  }

  async cancelRental(rentalId: number, user: ActiveUser) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { car: true },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    if (rental.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot cancel a rental with status ${rental.status}. Only PENDING rentals can be cancelled.`,
      );
    }

    if (user.role === 'USER') {
      if (rental.customerId !== user.id) {
        throw new ForbiddenException(
          'You are not allowed to cancel this rental',
        );
      }
    } else {
      this.validateAgencyOwnership(rental.car.agencyId, user);
    }

    return this.prisma.rental.update({
      where: { id: rentalId },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  async searchCars({ searchStartDate, searchEndDate }: searchCarsDTO) {
    const cars = await this.prisma.car.findMany({
      where: {
        rentals: {
          none: {
            status: { in: ['ACTIVE', 'PENDING'] },
            startDate: {
              lt: searchEndDate,
            },
            endDate: {
              gt: searchStartDate,
            },
          },
        },
      },
    });

    return cars;
  }

  async getMyBookings(customerId: number) {
    return this.prisma.rental.findMany({
      where: {
        customerId,
      },
      include: {
        car: {
          include: {
            images: true,
            agency: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getBookingById(rentalId: number, userId: number, userRole: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        car: {
          include: {
            images: true,
            agency: true,
          },
        },
      },
    });

    if (!rental) throw new NotFoundException('Rental not found');

    if (userRole === 'USER' && rental.customerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to view this booking',
      );
    }

    return rental;
  }
}
