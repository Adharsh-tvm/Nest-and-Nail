export interface IPaymentGateway {
    createOrder(amount: number): Promise<{
        orderId: string;
        amount: number;
        currency: string;
    }>;

    verifyPayment(data: {
        orderId: string;
        paymentId: string;
        signature: string;
    }): boolean;
}