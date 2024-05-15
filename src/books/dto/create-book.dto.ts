import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDecimal,
  IsUUID,
  IsArray,
  IsNumber,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
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

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  categoryIds: string[] = [];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  authorIds: string[] = [];
}
