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
import { Transmission } from 'generated/prisma/enums';

export class CarDataDTO {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seating_capacity: number;

  @IsString()
  @IsNotEmpty()
  fuel_type: string;

  @IsEnum(Transmission, {
    message: 'Transmission must be either MANUAL or AUTOMATIC',
  })
  transmission: Transmission;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_per_day: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agentId?: number;
}
