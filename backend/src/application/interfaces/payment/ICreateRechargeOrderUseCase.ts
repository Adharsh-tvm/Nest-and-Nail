export interface ICreateRechargeOrderUseCase {
    execute(amount: number, userId: string): Promise<{ orderId: string; amount: number; currency: string }>;
}