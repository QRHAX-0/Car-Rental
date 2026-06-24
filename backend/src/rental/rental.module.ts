import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RoleGuard } from '../common/guards/role.guard';

@Module({
  imports: [PrismaModule],
  controllers: [RentalController],
  providers: [RentalService, RoleGuard],
})
export class RentalModule {}
