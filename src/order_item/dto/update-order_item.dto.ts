import { IsOptional, IsInt, IsUUID } from 'class-validator';

export class UpdateOrderItemDto {
  @IsUUID()
  bookId: string;

  @IsOptional()
  @IsInt()
  quantity?: number;
}
