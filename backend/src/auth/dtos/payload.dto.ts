import {
  IsNumber,
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from 'generated/prisma/enums';

export class PayloadDto {
  @IsNotEmpty({ message: 'ID is required' })
  @IsNumber({}, { message: 'ID must be a number' })
  @Type(() => Number)
  id!: number;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email format' })
  email!: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Invalid role provided' })
  role!: string;

  @IsOptional()
  @IsNumber({}, { message: 'Agency ID must be a number' })
  @Type(() => Number)
  agencyId?: number;
}
