import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthorResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsString()
  image: string;

  @IsOptional()
  description: string;
}
