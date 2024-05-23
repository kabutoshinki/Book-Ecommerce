import { PaymentStatus } from 'src/enums/payment-status.enums';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';

export class OrderResponseDto {
  id: string;

  status: PaymentStatus;

  total: number;

  quantity: number;

  user: UserResponseDto;
}
