import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';
import { RentalModule } from './rental/rental.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // يخلي env متاحة في كل المشروع
    }),
    CarsModule,
    RentalModule,
  ],
})
export class AppModule {}
