import { Injectable } from '@nestjs/common';
import { HandlePaymentService } from './../interfaces/PaymentService';
import { MomoService } from './momo_payment.service';
import { VnpayService } from './vnpay_payment.service';

@Injectable()
export class PaymentService implements HandlePaymentService {
  constructor(
    private readonly momoService: MomoService,
    private readonly vnpayService: VnpayService,
  ) {}

  async createPayment(
    amount: number,
    orderInfo: string,
    type: string,
  ): Promise<any> {
    if (type === 'MOMO') {
      return this.momoService.createPayment(amount, orderInfo);
    } else if (type === 'NCB') {
      return this.vnpayService.createPayment(amount, orderInfo);
    } else {
      throw new Error('Unsupported payment type');
    }
  }
}
