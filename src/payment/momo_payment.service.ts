// import { PaymentService } from '../interfaces/PaymentService';
// import { Injectable } from '@nestjs/common';
// import * as crypto from 'crypto';
// import * as https from 'https';

// @Injectable()
// export class MomoPaymentService implements PaymentService {
//   private readonly partnerCode = 'MOMO';
//   private readonly accessKey = 'F8BBA842ECF85';
//   private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
//   private readonly redirectUrl =
//     'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//   private readonly ipnUrl =
//     'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';

//   async createPayment(amount: string, orderInfo: string): Promise<any> {
//     const orderId = this.partnerCode + new Date().getTime();
//     const requestId = orderId;

//     const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

//     const signature = crypto
//       .createHmac('sha256', this.secretKey)
//       .update(rawSignature)
//       .digest('hex');

//     const requestBody = JSON.stringify({
//       partnerCode: this.partnerCode,
//       partnerName: 'Test',
//       storeId: 'MomoTestStore',
//       requestId: requestId,
//       amount: amount,
//       orderId: orderId,
//       orderInfo: orderInfo,
//       redirectUrl: this.redirectUrl,
//       ipnUrl: this.ipnUrl,
//       lang: 'vi',
//       requestType: 'payWithMethod',
//       autoCapture: true,
//       extraData: '',
//       orderGroupId: '',
//       signature: signature,
//     });

//     const options = {
//       hostname: 'test-payment.momo.vn',
//       port: 443,
//       path: '/v2/gateway/api/create',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(requestBody),
//       },
//     };

//     return new Promise((resolve, reject) => {
//       const req = https.request(options, (res) => {
//         let data = '';
//         res.on('data', (chunk) => {
//           data += chunk;
//         });
//         res.on('end', () => {
//           resolve(JSON.parse(data));
//         });
//       });

//       req.on('error', (e) => {
//         reject(e);
//       });

//       req.write(requestBody);
//       req.end();
//     });
//   }
// }
