import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CarCategory, Transmission } from '@prisma/client';

export class UpdateCarDataDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  model?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: CarCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seatingCapacity?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fuelType?: string;

  @IsOptional()
  @IsEnum(Transmission, {
    message: 'Transmission must be either MANUAL or AUTOMATIC',
  })
  transmission?: Transmission;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerDay?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agencyId?: number;
}
