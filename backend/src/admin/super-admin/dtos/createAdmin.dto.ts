import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsNumber()
  @IsNotEmpty()
  agencyId!: number;
}
