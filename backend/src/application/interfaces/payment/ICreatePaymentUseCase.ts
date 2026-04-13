export interface ICreatePaymentUseCase {
    execute(
        serviceId: string,
        clientId: string,
        amount: number
    ): Promise<{
        orderId: string;
        currency: string;
        amount: number;
    }>;
}