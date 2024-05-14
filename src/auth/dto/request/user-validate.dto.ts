import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserValidateDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  avatar: string;
}
