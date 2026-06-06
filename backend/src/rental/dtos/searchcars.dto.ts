import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
export class searchCarsDTO {
  @Type(() => Date)
  @IsDate()
  searchStartDate!: Date;

  @Type(() => Date)
  @IsDate()
  searchEndDate!: Date;
}
