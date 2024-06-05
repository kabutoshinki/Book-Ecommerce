import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class BookOrderResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  sold_quantity: number;
}
