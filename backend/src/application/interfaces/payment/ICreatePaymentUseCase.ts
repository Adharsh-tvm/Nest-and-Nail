export interface ICreatePaymentUseCase {
    execute(
        serviceId: string,
        clientId: string
    ): Promise<{
        orderId: string;
        currency: string;
        amount: number;
    }>;
}