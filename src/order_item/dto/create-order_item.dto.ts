import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
