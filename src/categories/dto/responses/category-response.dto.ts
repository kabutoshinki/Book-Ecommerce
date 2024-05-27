import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
