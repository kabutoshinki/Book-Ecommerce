import { IsDate, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class DiscountResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  description: string;
}
