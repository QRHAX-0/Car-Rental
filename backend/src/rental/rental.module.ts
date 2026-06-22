import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleGuard } from 'src/common/guards/role.guard';

@Module({
  imports: [PrismaModule],
  controllers: [RentalController],
  providers: [RentalService, RoleGuard],
})
export class RentalModule {}
