import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsArray,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class BooksQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value.split(',').map((val: string) => val.trim()),
  )
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value.split(',').map((val: string) => val.trim()),
  )
  @IsArray()
  @IsString({ each: true })
  authors?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minRate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxRate?: number;

  @IsOptional()
  @IsIn(['priceLow', 'priceHigh', 'popularity', 'onSale'])
  sort?: 'priceLow' | 'priceHigh' | 'popularity' | 'onSale';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
