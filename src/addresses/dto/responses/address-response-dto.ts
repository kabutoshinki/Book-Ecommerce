import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AddressResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  address_line_1: string;

  @IsOptional()
  address_line_2: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  isSelected: boolean;

  @IsOptional()
  phone_number: string;
}
