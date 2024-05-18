import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
