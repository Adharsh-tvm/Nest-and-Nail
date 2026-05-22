import { PaymentStatus } from "../../shared/enums/paymentEnums";

export interface Payment {
    id: string;

    serviceId: string;
    clientId: string;

    amount: number;
    currency: string;

    orderId: string;
    paymentId?: string;
    signature?: string;

    status: PaymentStatus;

    createdAt: Date;
}