import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import { Transform } from 'class-transformer';

export class BookResponseDto {
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
  image: string;

  @IsOptional()
  @IsUUID()
  discountId?: string;

  @IsOptional()
  @IsUUID()
  publisherId?: string;

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
