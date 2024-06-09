export interface HandlePaymentService {
  createPayment(amount: number, orderInfo: string, type: string): Promise<any>;
}
