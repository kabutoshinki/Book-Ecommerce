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
import { IsUuidArray } from 'src/decorators/arrayUuid-validator';
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

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  discountId?: string;

  @IsOptional()
  publisherId?: string;

  @IsUuidArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @IsOptional()
  @IsArray()
  categoryIds: string[] = [];

  @IsUuidArray()
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  authorIds: string[] = [];
}
