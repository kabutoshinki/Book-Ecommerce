import { PaymentStatus } from 'src/enums/payment-status.enums';
import { OrderItemResponseDto } from 'src/order_item/dto/responses/order-items-response.dto';

export class OrderGetItemsResponseDto {
  id: string;

  status: PaymentStatus;

  item: OrderItemResponseDto[];
}
