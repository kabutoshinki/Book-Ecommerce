import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsUuidArray } from 'src/decorators/arrayUuid-validator';

export class BookResponseForAdminDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  image: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @IsDate()
  @IsNotEmpty()
  updated_at: Date;

  @IsOptional()
  @IsUUID()
  discountId?: string;

  @IsOptional()
  @IsUUID()
  publisherId?: string;

  @IsUuidArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @IsOptional()
  @IsArray()
  categoryIds: string[] = [];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  authorIds: string[] = [];
}
