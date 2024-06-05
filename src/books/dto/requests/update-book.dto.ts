import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDecimal,
  IsUUID,
  IsArray,
  IsNumber,
  isUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class UpdateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  average_rate?: number;

  @IsOptional()
  discountId?: string;

  @IsOptional()
  publisherId?: string;

  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @IsOptional()
  @IsArray()
  categoryIds: string[] = [];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  authorIds: string[] = [];
}
