import { PaymentStatus } from 'src/enums/payment-status.enums';
import { OrderItemResponseDto } from 'src/order_item/dto/responses/order-items-response.dto';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';

export class OrderDetailResponseDto {
  id: string;

  status: PaymentStatus;

  total: number;

  quantity: number;

  user: UserResponseDto;

  item: OrderItemResponseDto[];

  created_at: string;

  updated_at: string;
}
