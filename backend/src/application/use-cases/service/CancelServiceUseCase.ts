import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
import { ICancelServiceUseCase } from "../../interfaces/service/ICancelServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { transactionSource, transactionStatus, transactionType } from "../../../shared/enums/transactionEnums";
import { ServiceMapper } from "../../mappers/ServiceMapper";
import { ServiceResponseDTO } from "../../dtos/ServiceDTO";

/**
 * Refund tiers (measured from booking creation time):
 *  < 15 min  → 100% refund
 *  15 min – 1 hr → 90% refund
 *  1 hr – 6 hr   → 50% refund
 *  > 6 hr        → no cancellation allowed
 */
function getRefundPercentage(diffInMs: number): number {
    const FIFTEEN_MIN = 15 * 60 * 1000;
    const ONE_HOUR    = 60 * 60 * 1000;

    if (diffInMs < FIFTEEN_MIN) return 100;
    if (diffInMs < ONE_HOUR)    return 90;
    return 50;
}

import { ISendNotificationUseCase } from "../../interfaces/notifications/ISendNotificationUseCase";

export class CancelServiceUseCase implements ICancelServiceUseCase {

    constructor(
        private readonly _serviceRepo: IServiceRepository,
        private readonly _scheduleRepo: IWorkerScheduleRepository,
        private readonly _walletRepo: IWalletRepository,
        private readonly _transactionRepo: ITransactionRepository,
        private readonly _userRepoFactory: IUserRepositoryFactory,
        private readonly _sendNotification: ISendNotificationUseCase
    ) { }

    async execute(serviceId: string, userId: string, reason?: string): Promise<ServiceResponseDTO> {

        const service = await this._serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        //  Authorization
        if (service.clientId !== userId && service.workerId !== userId) {
            throw new Error("Unauthorized");
        }

        //  Cannot cancel completed
        if (service.status === ServiceStatus.COMPLETED) {
            throw new Error("Cannot cancel completed service");
        }

        const now = new Date();
        const createdAt = new Date(service.createdAt);
        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        //  Cancellation window closed after 6 hours
        if (diffInHours > 6) {
            throw new Error(
                "Cannot cancel service after 6 hours of booking. The cancellation window has expired."
            );
        }

        const updated = await this._serviceRepo.updateStatus(serviceId, {
            status: ServiceStatus.CANCELLED,
            cancelledAt: now,
            updatedAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to cancel service");
        }

        //  Process refund to client's wallet (only if payment was successful)
        if (service.paymentStatus === PaymentStatus.SUCCESS && service.totalAmount > 0) {
            const refundPct = getRefundPercentage(diffInMs);
            const refundAmount = Math.floor((service.totalAmount * refundPct) / 100);

            if (refundAmount > 0) {
                try {
                    // Ensure wallet exists; create one if not
                    const wallet = await this._walletRepo.findByUserId(service.clientId);
                    if (!wallet) {
                        await this._walletRepo.create({
                            walletId: `wallet_${service.clientId}`,
                            userId: service.clientId,
                            balance: 0,
                            currency: "INR",
                        });
                    }
                    await this._walletRepo.creditBalance(service.clientId, refundAmount);

                    // Add transaction record
                    await this._transactionRepo.create({
                        transactionId: `txn_refund_${serviceId}_${Date.now()}`,
                        walletId: wallet ? wallet.walletId : `wallet_${service.clientId}`,
                        userId: service.clientId,
                        type: transactionType.CREDIT,
                        amount: refundAmount,
                        source: transactionSource.REFUND,
                        serviceId: serviceId,
                        status: transactionStatus.SUCCESS,
                        createdAt: new Date()
                    });

                    // Debit admin wallet
                    const adminRepo = this._userRepoFactory.getRepository(Role.ADMIN);
                    const admins = await adminRepo.findAll();
                    const admin = admins[0];

                    if (admin) {
                        let adminWallet = await this._walletRepo.findByUserId(admin.userId);
                        if (adminWallet) {
                            try {
                                const updatedAdminWallet = await this._walletRepo.debitBalance(admin.userId, refundAmount);
                                
                                await this._transactionRepo.create({
                                    transactionId: `txn_refund_debit_${serviceId}_${Date.now()}`,
                                    walletId: updatedAdminWallet.walletId,
                                    userId: admin.userId,
                                    type: transactionType.DEBIT,
                                    amount: refundAmount,
                                    source: transactionSource.REFUND,
                                    serviceId: serviceId,
                                    status: transactionStatus.SUCCESS,
                                    createdAt: new Date(),
                                });
                            } catch (err) {
                                console.error("Failed to debit admin wallet:", err);
                            }
                        }
                    }
                } catch (walletErr) {
                    // Wallet credit failure should not block the cancellation
                    console.error("Refund wallet credit failed:", walletErr);
                }
            }
        }

        //  Free up the worker's schedule slots
        for (const slot of service.selectedSlots) {
            await this._scheduleRepo.unmarkAsBooked(
                service.workerId,
                slot.date,
                slot.slotType
            );
        }

        //  Send Notification
        try {
            const isClientCancelling = userId === service.clientId;
            const targetUserId = isClientCancelling ? service.workerId : service.clientId;
            const cancellerRole = isClientCancelling ? "Client" : "Worker";
            const isVideoCall = service.category === "VIDEO_CALL";

            await this._sendNotification.execute({
                userId: targetUserId,
                title: isVideoCall ? "Meeting Cancelled" : "Service Cancelled",
                message: isVideoCall 
                    ? `The video call (ID: ${serviceId}) has been cancelled by the ${cancellerRole}.`
                    : `The service (ID: ${serviceId}) has been cancelled by the ${cancellerRole}.`,
                type: isVideoCall ? "MEETING_CANCELLED" : "SERVICE_CANCELLED",
                data: { serviceId }
            });
        } catch (notifErr) {
            console.error("Failed to send cancellation notification:", notifErr);
        }

        return ServiceMapper.toResponse(updated);
    }
}
