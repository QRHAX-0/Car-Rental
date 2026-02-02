import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // يخلي env متاحة في كل المشروع
    }),
    CarsModule,
  ],
})
export class AppModule {}
