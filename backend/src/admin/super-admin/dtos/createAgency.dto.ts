import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  logo?: string;
}
