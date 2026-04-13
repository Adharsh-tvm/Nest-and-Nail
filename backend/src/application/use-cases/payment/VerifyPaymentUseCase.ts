// application/use-cases/payment/VerifyPaymentUseCase.ts

import { IPaymentGateway } from "../../../domain/gateways/IPaymentGateway";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { IVerifyPaymentUseCase } from "../../interfaces/payment/IVerifyPaymentUseCase";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private paymentRepo: IPaymentRepository,
        private paymentGateway: IPaymentGateway,
        private serviceRepo: IServiceRepository
    ) { }

    async execute(data: {
        orderId: string;
        paymentId: string;
        signature: string;
    }) {

        const isValid = this.paymentGateway.verifyPayment(data);

        if (!isValid) throw new Error("Invalid payment");

        const payment = await this.paymentRepo.findByOrderId(data.orderId);
        if (!payment) throw new Error("Payment not found");

        if (payment.status === "SUCCESS") {
            return { success: true };
        }

        await this.paymentRepo.updateByOrderId(data.orderId, {
            paymentId: data.paymentId,
            signature: data.signature,
            status: PaymentStatus.SUCCESS
        });

        await this.serviceRepo.updatePaymentStatus(
            payment.serviceId,
            "SUCCESS"
        );

        return { success: true };
    }
}