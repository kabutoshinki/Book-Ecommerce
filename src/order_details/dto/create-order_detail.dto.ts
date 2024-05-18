import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/order_item/dto/create-order_item.dto';

export class CreateOrderDetailDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsArray()
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
