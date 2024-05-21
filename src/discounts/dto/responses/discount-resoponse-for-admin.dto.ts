import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

export class DiscountResponseForAdminDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  startAt: string;

  @IsDate()
  @IsNotEmpty()
  expiresAt: string;

  @IsDate()
  @IsNotEmpty()
  created_at: string;

  @IsDate()
  @IsNotEmpty()
  updated_at: string;
}
