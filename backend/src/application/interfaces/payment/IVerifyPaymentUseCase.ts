export interface IVerifyPaymentUseCase {
  execute(data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<{ success: boolean }>;
}