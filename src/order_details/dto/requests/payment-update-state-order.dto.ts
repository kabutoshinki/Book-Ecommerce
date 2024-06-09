import { PaymentStatus } from 'src/enums/payment-status.enums';

export class PaymentUpdateOrderStateDto {
  state: PaymentStatus;
}
