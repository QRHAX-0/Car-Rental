import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { FuelLevel } from '@prisma/client';

export class PickupRentalDto {
  @IsInt()
  @IsNotEmpty()
  currentMileage!: number;

  @IsEnum(FuelLevel)
  @IsNotEmpty()
  fuelLevel!: FuelLevel;
}
