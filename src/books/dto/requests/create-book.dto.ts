import { Transform } from 'class-transformer';
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
import { IsUuidArray } from 'src/decorators/arrayUuid-validator';

export class CreateBookDto {
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
