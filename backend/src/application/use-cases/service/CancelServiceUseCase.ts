import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
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

export class CancelServiceUseCase implements ICancelServiceUseCase {

    constructor(
        private readonly _serviceRepo: IServiceRepository,
        private readonly _scheduleRepo: IWorkerScheduleRepository,
        private readonly _walletRepo: IWalletRepository,
        private readonly _transactionRepo: ITransactionRepository
    ) { }

    async execute(serviceId: string, userId: string, reason?: string): Promise<ServiceResponseDTO> {

        const service = await this._serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        // 🔒 Authorization
        if (service.clientId !== userId && service.workerId !== userId) {
            throw new Error("Unauthorized");
        }

        // ❌ Cannot cancel completed
        if (service.status === ServiceStatus.COMPLETED) {
            throw new Error("Cannot cancel completed service");
        }

        const now = new Date();
        const createdAt = new Date(service.createdAt);
        const diffInMs = now.getTime() - createdAt.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        // ⛔ Cancellation window closed after 6 hours
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

        // 💰 Process refund to client's wallet (only if payment was successful)
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
                } catch (walletErr) {
                    // Wallet credit failure should not block the cancellation
                    console.error("Refund wallet credit failed:", walletErr);
                }
            }
        }

        // 🗓️ Free up the worker's schedule slots
        for (const slot of service.selectedSlots) {
            await this._scheduleRepo.unmarkAsBooked(
                service.workerId,
                slot.date,
                slot.slotType
            );
        }

        return ServiceMapper.toResponse(updated);
    }
}