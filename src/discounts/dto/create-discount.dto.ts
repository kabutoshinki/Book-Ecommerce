import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  amount: number;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expiresAt: Date;

  @IsArray()
  @IsOptional()
  bookIds: string[];
}
