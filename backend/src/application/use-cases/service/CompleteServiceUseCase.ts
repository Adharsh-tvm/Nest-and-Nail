import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { ICompleteServiceUseCase } from "../../interfaces/service/ICompleteServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { transactionSource, transactionStatus, transactionType } from "../../../shared/enums/transactionEnums";
import { Role } from "../../../shared/enums/authEnums";
import { ServiceMapper } from "../../mappers/ServiceMapper";
import { v4 as uuidv4 } from "uuid";

import { ISendNotificationUseCase } from "../../interfaces/notifications/ISendNotificationUseCase";

export class CompleteServiceUseCase implements ICompleteServiceUseCase {
    constructor(
        private readonly _serviceRepo: IServiceRepository,
        private readonly _walletRepo: IWalletRepository,
        private readonly _transactionRepo: ITransactionRepository,
        private readonly _userRepoFactory: IUserRepositoryFactory,
        private readonly _sendNotification: ISendNotificationUseCase
    ) { }

    async execute(serviceId: string, workerId: string) {

        const service = await this._serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        //  Authorization
        if (service.workerId !== workerId) {
            throw new Error("Unauthorized");
        }

        //  State validation
        if (service.status !== ServiceStatus.IN_PROGRESS) {
            throw new Error("Service not in progress");
        }

        const updated = await this._serviceRepo.updateStatus(serviceId, {
            status: ServiceStatus.COMPLETED,
            completedAt: new Date(),
            updatedAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to complete service");
        }

        // Transfer funds from Admin to Worker if payment was successful
        if (service.paymentStatus === PaymentStatus.SUCCESS && service.totalAmount > 0) {
            const platformFee = service.category === "VIDEO_CALL" ? 10 : 50;
            const workerShare = service.totalAmount - platformFee;

            if (workerShare > 0) {
                // Credit Worker
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
                    serviceId: service.serviceId,
                    status: transactionStatus.SUCCESS,
                    createdAt: new Date(),
                });

                // Debit admin wallet
                const adminRepo = this._userRepoFactory.getRepository(Role.ADMIN);
                const admins = await adminRepo.findAll();
                const admin = admins[0];

                if (admin) {
                    const adminWallet = await this._walletRepo.findByUserId(admin.userId);
                    if (adminWallet) {
                        try {
                            const updatedAdminWallet = await this._walletRepo.debitBalance(admin.userId, workerShare);
                            
                            await this._transactionRepo.create({
                                transactionId: uuidv4(),
                                walletId: updatedAdminWallet.walletId,
                                userId: admin.userId,
                                type: transactionType.DEBIT,
                                amount: workerShare,
                                source: transactionSource.SERVICE_PAYMENT,
                                serviceId: service.serviceId,
                                status: transactionStatus.SUCCESS,
                                createdAt: new Date(),
                            });
                        } catch (err) {
                            console.error("Failed to debit admin wallet:", err);
                        }
                    }
                }
            }
        }

        //  Send Notification
        try {
            await this._sendNotification.execute({
                userId: service.clientId,
                title: "Service Completed",
                message: `Your service (ID: ${serviceId}) has been successfully completed.`,
                type: "SERVICE_COMPLETED",
                data: { serviceId }
            });
        } catch (notifErr) {
            console.error("Failed to send completion notification:", notifErr);
        }

        return ServiceMapper.toResponse(updated);
    }
}