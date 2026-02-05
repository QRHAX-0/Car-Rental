import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { RentCarDTO } from './dtos/rentcar.dto';

@Injectable()
export class RentalService {
  constructor(private readonly prisam: PrismaService) {}

  //   async rentCar({ userId, carId, startDate, endDate }: RentCarDTO) {}
}
