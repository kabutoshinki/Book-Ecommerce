import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class PublisherResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;
}
