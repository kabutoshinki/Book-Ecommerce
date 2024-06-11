import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MomoService } from './momo_payment.service';
import { VnpayService } from './vnpay_payment.service';

@Module({
  providers: [PaymentService, MomoService, VnpayService],
  exports: [PaymentService],
})
export class PaymentModule {}
