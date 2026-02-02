import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
// import { IsNumber } from 'class-transformer'
export class CarDataDTO {
  model: string;
  brand: string;
  image: string;
  year: number;
  category: string;
  seating_capacity: number;
  fuel_type: string;
  transmission: 'AUTOMATIC' | 'MANUAL';
  price_per_day: number;
  location: string;
  description: string;
  isAvailable?: boolean;
  @IsOptional() // 👈 اختياري (للأدمن العادي)
  @IsNumber()
  @Type(() => Number)
  agentId?: number;
}
