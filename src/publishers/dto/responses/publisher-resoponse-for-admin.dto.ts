import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

export class PublisherResponseForAdminDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  created_at: string;

  @IsDate()
  @IsNotEmpty()
  updated_at: string;
}
