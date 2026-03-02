import { IsEmail, IsString } from 'class-validator';

export class registerDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  password: string;

  @IsString()
  image: string;
}
