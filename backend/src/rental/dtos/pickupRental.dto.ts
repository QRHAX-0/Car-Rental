import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { FuelLevel } from 'generated/prisma/enums';

export class PickupRentalDto {
  @IsInt()
  @IsNotEmpty()
  currentMileage!: number;

  @IsEnum(FuelLevel)
  @IsNotEmpty()
  fuelLevel!: FuelLevel;
}
