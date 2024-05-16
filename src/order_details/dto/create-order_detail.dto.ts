import { IsNotEmpty, IsNumber } from 'class-validator';
import { OrderItem } from 'src/order_item/entities/order_item.entity';

export class CreateOrderDetailDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsNotEmpty()
  orderItems: OrderItem[];
}
