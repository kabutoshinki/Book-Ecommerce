import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserDetailDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  avatar: string;
}
