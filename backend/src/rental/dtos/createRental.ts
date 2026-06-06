import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreateRent {
  @Type(() => Number)
  @IsNumber()
  carId!: number;

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}
