import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { IsUuidArray } from 'src/decorators/arrayUuid-validator';
import { Transform } from 'class-transformer';

export class BookOrderResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  sold_quantity: number;
}
