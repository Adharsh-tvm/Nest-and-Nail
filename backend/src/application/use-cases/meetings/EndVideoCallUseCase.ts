import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { ServiceStatus, VideoCallStatus } from "../../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { transactionSource, transactionStatus, transactionType } from "../../../shared/enums/transactionEnums";
import { Role } from "../../../shared/enums/authEnums";
import { IEndVideoCallUseCase } from "../../interfaces/meetings/IEndVideoCallUseCase";
import { v4 as uuidv4 } from "uuid";

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export class EndVideoCallUseCase implements IEndVideoCallUseCase {
  constructor(
      private serviceRepository: IServiceRepository,
      private readonly _walletRepo: IWalletRepository,
      private readonly _transactionRepo: ITransactionRepository,
      private readonly _userRepoFactory: IUserRepositoryFactory
  ) {}

  async execute(serviceId: string, userId: string) {
    const service = await this.serviceRepository.findById(serviceId);

    if (!service) throw new Error("Service not found");
    if (!service.videoCall) throw new Error("Meeting not found");

    if (service.clientId !== userId && service.workerId !== userId) {
      throw new Error("Unauthorized");
    }

    if (service.videoCall.status === VideoCallStatus.ENDED) {
      return {
        message: "Meeting already ended",
        videoCall: service.videoCall,
      };
    }

    const endedAt = new Date();
    let totalSeconds = service.videoCall.accumulatedDuration ?? 0;

    if (service.videoCall.startedAt) {
      const segmentMs = endedAt.getTime() - new Date(service.videoCall.startedAt).getTime();
      totalSeconds += Math.floor(segmentMs / 1000);
    }

    const duration = totalSeconds > 0 ? formatDuration(totalSeconds) : "0s";

    const updatedVideoCall = {
      ...service.videoCall,
      status: VideoCallStatus.ENDED,
      endedAt,
      duration,
      accumulatedDuration: totalSeconds,
      startedAt: null, // Clear startedAt
    };

    const updated = await this.serviceRepository.updateVideoCall(serviceId, updatedVideoCall);

    await this.serviceRepository.updateStatus(serviceId, {
      status: ServiceStatus.COMPLETED,
    });

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

    return {
      message: "Meeting ended successfully",
      videoCall: updated.videoCall,
    };
  }
}