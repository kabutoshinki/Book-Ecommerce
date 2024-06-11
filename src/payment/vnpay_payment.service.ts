import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlePaymentService } from './../interfaces/PaymentService';
import * as crypto from 'crypto';

@Injectable()
export class VnpayService implements HandlePaymentService {
  constructor(private readonly configService: ConfigService) {}

  USD_TO_VND_RATE = 23000;
  private readonly vnpayConfig = {
    tmnCode: this.configService.get('vnpay.tmn_code'),
    hashSecret: this.configService.get('vnpay.hash_secret'),
    url: this.configService.get('vnpay.url'),
    api: this.configService.get('vnpay.api'),
    returnUrl: this.configService.get('vnpay.return_url'),
  };

  async createPayment(amount: number, orderInfo: string): Promise<any> {
    const { tmnCode, hashSecret, url, returnUrl } = this.vnpayConfig;
    const vnpOrderId = tmnCode + new Date().getTime();
    const locale = 'vn';
    const currCode = 'VND';
    const ipAddr = '127.0.0.1';
    const createDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, '')
      .replace(/:/g, '')
      .replace('T', '');
    const orderType = 'billpayment';
    const amountVnd = parseFloat(
      (amount * this.USD_TO_VND_RATE * 100)?.toFixed(2),
    ); // Ensure amount is converted to the smallest currency unit

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: vnpOrderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amountVnd,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnp_Params = this.sortObject(vnp_Params);
    const signData = new URLSearchParams(vnp_Params).toString();
    const secureHash = crypto
      .createHmac('sha512', hashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');
    vnp_Params['vnp_SecureHash'] = secureHash;

    const payUrl = `${url}?${new URLSearchParams(vnp_Params).toString()}`;

    return { payUrl };
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }
}
