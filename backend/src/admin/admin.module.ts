import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin/super-admin.controller';
import { AgencyAdminController } from './agency-admin/agency-admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CarsModule } from 'src/cars/cars.module';
import { AuthModule } from 'src/auth/auth.module';
import { CarsService } from 'src/cars/cars.service';
import { RentalService } from 'src/rental/rental.service';

@Module({
  imports: [PrismaModule, CarsModule, AuthModule],
  controllers: [SuperAdminController, AgencyAdminController],
  providers: [CarsService, RentalService],
})
export class AdminModule {}
