import { ConfigService } from '@nestjs/config';
import { HandlePaymentService } from './../interfaces/PaymentService';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as https from 'https';

@Injectable()
export class PaymentService implements HandlePaymentService {
  constructor(private readonly configService: ConfigService) {}
  USD_TO_VND_RATE = 23000;
  private readonly momoConfig = {
    partnerCode: this.configService.get('momo.partner_code'),
    accessKey: this.configService.get('momo.access_key'),
    secretKey: this.configService.get('secret_key'),
    redirectUrl: this.configService.get('redirect_url'),
    ipnUrl: this.configService.get('ipn_url'),
  };
  private readonly vnpayConfig = {
    tmnCode: this.configService.get('vnpay.tmn_code'),
    hashSecret: this.configService.get('vnpay.hash_secret'),
    url: this.configService.get('vnpay.url'),
    api: this.configService.get('vnpay.api'),
    returnUrl: this.configService.get('vnpay.return_url'),
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

  private async createVnpayPayment(
    amount: number,
    orderInfo: string,
  ): Promise<any> {
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
