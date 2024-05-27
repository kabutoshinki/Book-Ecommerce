import { PaymentStatus } from 'src/enums/payment-status.enums';
import { OrderItemBooksResponseDto } from 'src/order_item/dto/responses/order-items-books-response';
import { OrderItemResponseDto } from 'src/order_item/dto/responses/order-items-response.dto';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';

export class OrderDetailGetItemsResponseDto {
  id: string;

  status: PaymentStatus;

  item: OrderItemBooksResponseDto[];
}
