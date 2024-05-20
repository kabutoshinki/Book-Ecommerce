import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
