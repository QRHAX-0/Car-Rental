import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { FuelLevel } from '@prisma/client';

export class ReturnRentalDto {
  @IsInt()
  @IsNotEmpty()
  endMileage!: number;

  @IsEnum(FuelLevel)
  @IsNotEmpty()
  fuelLevel!: FuelLevel;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalCharges?: number;
}
