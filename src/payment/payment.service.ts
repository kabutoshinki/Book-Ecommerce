import { HandlePaymentService } from './../interfaces/PaymentService';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as https from 'https';

@Injectable()
export class PaymentService implements HandlePaymentService {
  USD_TO_VND_RATE = 23000;
  private readonly momoConfig = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    redirectUrl: 'http://localhost:5173/loading',
    ipnUrl: 'http://localhost:5173/loading',
  };

  async createPayment(
    amount: number,
    orderInfo: string,
    type: string,
  ): Promise<any> {
    if (type === 'MOMO') {
      return this.createMomoPayment(amount, orderInfo);
    } else if (type === 'NCB') {
      return this.createVnpayPayment(amount, orderInfo);
    } else {
      throw new Error('Unsupported payment type');
    }
  }

  private async createMomoPayment(
    amount: number,
    orderInfo: string,
  ): Promise<any> {
    const { partnerCode, accessKey, secretKey, redirectUrl, ipnUrl } =
      this.momoConfig;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;

    const rawSignature = `accessKey=${accessKey}&amount=${parseFloat(
      (amount * this.USD_TO_VND_RATE).toFixed(2),
    )}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId,
      amount: parseFloat((amount * this.USD_TO_VND_RATE)?.toFixed(2)),
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: 'vi',
      requestType: 'payWithMethod',
      autoCapture: true,
      extraData: '',
      orderGroupId: '',
      signature,
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(requestBody);
      req.end();
    });
  }

  private async createVnpayPayment(
    amount: number,
    orderInfo: string,
  ): Promise<any> {
    // Implement the VNPay payment logic here
    // This should return the payment URL or other necessary information
    return {
      payUrl: 'https://pay.vnpay.vn/...',
      // other response data
    };
  }
}
