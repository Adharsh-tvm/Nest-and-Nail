import { IPaymentGateway } from "../../../domain/gateways/IPaymentGateway";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
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
        private readonly _transactionRepo: ITransactionRepository,
        private readonly _scheduleRepo: IWorkerScheduleRepository,
        private readonly _userRepoFactory: IUserRepositoryFactory
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
            // Mark worker schedule slots as booked now that payment is confirmed
            for (const slot of service.selectedSlots || []) {
                await this._scheduleRepo.markAsBooked(
                    service.workerId,
                    slot.date,
                    slot.slotType,
                    service.serviceId
                );
            }

            // Calculate platform fee and worker share
            const platformFee = service.category === "VIDEO_CALL" ? 10 : 50;
            const workerShare = payment.amount - platformFee;

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

            const updatedWorkerWallet = await this._walletRepo.creditBalance(workerId, workerShare);

            await this._transactionRepo.create({
              transactionId: uuidv4(),
              walletId: updatedWorkerWallet.walletId,
              userId: workerId,
              type: transactionType.CREDIT,
              amount: workerShare,
              source: transactionSource.SERVICE_PAYMENT,
              serviceId: payment.serviceId,
              status: transactionStatus.SUCCESS,
              createdAt: new Date(),
            });

            // Credit admin wallet with platform fee
            const adminRepo = this._userRepoFactory.getRepository(Role.ADMIN);
            const admins = await adminRepo.findAll();
            const admin = admins[0];

            if (admin) {
                let adminWallet = await this._walletRepo.findByUserId(admin.userId);
                if (!adminWallet) {
                    adminWallet = await this._walletRepo.create({
                        walletId: uuidv4(),
                        userId: admin.userId,
                        balance: 0,
                        currency: "INR"
                    });
                }

                const updatedAdminWallet = await this._walletRepo.creditBalance(admin.userId, platformFee);

                await this._transactionRepo.create({
                    transactionId: uuidv4(),
                    walletId: updatedAdminWallet.walletId,
                    userId: admin.userId,
                    type: transactionType.CREDIT,
                    amount: platformFee,
                    source: transactionSource.SERVICE_PAYMENT,
                    serviceId: payment.serviceId,
                    status: transactionStatus.SUCCESS,
                    createdAt: new Date(),
                });
            }
        }

        return { success: true };
    }
}