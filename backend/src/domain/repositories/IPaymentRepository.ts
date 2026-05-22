import { Payment } from "../entities/Payment";

export interface IPaymentRepository {
    create(payment: Payment): Promise<Payment>;
    updateByOrderId(orderId: string, data: Partial<Payment>): Promise<void>;
    findByOrderId(orderId: string): Promise<Payment | null>;
}