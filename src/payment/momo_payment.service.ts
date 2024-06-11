import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlePaymentService } from './../interfaces/PaymentService';
import * as crypto from 'crypto';
import * as https from 'https';

@Injectable()
export class MomoService implements HandlePaymentService {
  constructor(private readonly configService: ConfigService) {}

  USD_TO_VND_RATE = 23000;
  private readonly momoConfig = {
    partnerCode: this.configService.get('momo.partner_code'),
    accessKey: this.configService.get('momo.access_key'),
    secretKey: this.configService.get('secret_key'),
    redirectUrl: this.configService.get('redirect_url'),
    ipnUrl: this.configService.get('ipn_url'),
  };

  async createPayment(amount: number, orderInfo: string): Promise<any> {
    const { partnerCode, accessKey, secretKey, redirectUrl, ipnUrl } =
      this.momoConfig;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;

    const rawSignature = `accessKey=${accessKey}&amount=${parseFloat(
      (amount * this.USD_TO_VND_RATE).toFixed(2),
    )}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;
    console.log(rawSignature);
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
}
