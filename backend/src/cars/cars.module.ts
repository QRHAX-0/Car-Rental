import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [CarsController],
  providers: [CarsService, JwtAuthStrategy],
})
export class CarsModule {}
