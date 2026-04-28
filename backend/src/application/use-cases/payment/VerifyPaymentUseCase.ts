import { IPaymentGateway } from "../../../domain/gateways/IPaymentGateway";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { v4 as uuidv4 } from "uuid";
import { transactionSource, transactionStatus, transactionType } from "../../../shared/enums/transactionEnums";
import { IVerifyPaymentUseCase } from "../../interfaces/payment/IVerifyPaymentUseCase";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private readonly _paymentRepo: IPaymentRepository,
        private readonly _paymentGateway: IPaymentGateway,
        private readonly _serviceRepo: IServiceRepository,
        private readonly _walletRepo: IWalletRepository,
        private readonly _transactionRepo: ITransactionRepository
    ) { }

    async execute(data: {
        orderId: string;
        paymentId: string;
        signature: string;
    }) {

        const isValid = this._paymentGateway.verifyPayment(data);

        if (!isValid) throw new Error("Invalid payment");

        const payment = await this._paymentRepo.findByOrderId(data.orderId);
        if (!payment) throw new Error("Payment not found");

        if (payment.status === "SUCCESS") {
            return { success: true };
        }

        await this._paymentRepo.updateByOrderId(data.orderId, {
            paymentId: data.paymentId,
            signature: data.signature,
            status: PaymentStatus.SUCCESS
        });

        await this._serviceRepo.updatePaymentStatus(
            payment.serviceId,
            "SUCCESS"
        );

        await this._serviceRepo.updateStatus(payment.serviceId,{
            status: ServiceStatus.CONFIRMED
        })

        const service = await this._serviceRepo.findById(payment.serviceId);
        if (service) {
            const workerId = service.workerId;
            let workerWallet = await this._walletRepo.findByUserId(workerId);
            if (!workerWallet) {
                workerWallet = await this._walletRepo.create({
                    walletId: uuidv4(),
                    userId: workerId,
                    balance: 0,
                    currency: "INR"
                });
            }

            const updatedWorkerWallet = await this._walletRepo.creditBalance(workerId, payment.amount);

            await this._transactionRepo.create({
              transactionId: uuidv4(),
              walletId: updatedWorkerWallet.walletId,
              userId: workerId,
              type: transactionType.CREDIT,
              amount: payment.amount,
              source: transactionSource.SERVICE_PAYMENT,
              serviceId: payment.serviceId,
              status: transactionStatus.SUCCESS,
              createdAt: new Date(),
            });
        }

        return { success: true };
    }
}