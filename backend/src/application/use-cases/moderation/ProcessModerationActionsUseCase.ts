import { v4 as uuidv4 } from "uuid";
import { IProcessModerationActionsUseCase } from "../../interfaces/moderation/IProcessModerationActionsUseCase";
import { ProcessModerationResultDTO } from "../../dtos/ModerationDTO";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IBaseRepository } from "../../../domain/repositories/IBaseRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IClientWorkerRestrictionRepository } from "../../../domain/repositories/IClientWorkerRestrictionRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { ISendNotificationUseCase } from "../../interfaces/notifications/ISendNotificationUseCase";
import { User } from "../../../domain/entities/User";
import { Service } from "../../../domain/entities/Service";
import { Role } from "../../../shared/enums/authEnums";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { transactionType, transactionSource, transactionStatus } from "../../../shared/enums/transactionEnums";

export class ProcessModerationActionsUseCase implements IProcessModerationActionsUseCase {
  constructor(
    private readonly _serviceRepo: IServiceRepository,
    private readonly _workerRepo: IWorkerRepository,
    private readonly _userRepo: IBaseRepository<User>,
    private readonly _walletRepo: IWalletRepository,
    private readonly _transactionRepo: ITransactionRepository,
    private readonly _restrictionRepo: IClientWorkerRestrictionRepository,
    private readonly _userRepoFactory: IUserRepositoryFactory,
    private readonly _sendNotification: ISendNotificationUseCase
  ) {}

  async execute(): Promise<ProcessModerationResultDTO> {
    const now = new Date();
    let case1Count = 0;
    let case2Count = 0;
    let case3Count = 0;

    // ─────────────────────────────────────────────────────────────────────────
    // CASE 1: WORKER MISSED PHYSICAL SERVICE
    // ─────────────────────────────────────────────────────────────────────────
    const physicalServices = await this._serviceRepo.findPassedConfirmedPhysicalServices(now);

    for (const service of physicalServices) {
      try {
        // 1. Mark service as NO_SHOW
        await this._serviceRepo.updateStatus(service.serviceId, {
          status: ServiceStatus.NO_SHOW,
          paymentStatus: PaymentStatus.REFUNDED,
          updatedAt: now,
        });

        // 2. Suspend worker from accepting NEW bookings for 3 days (additively if already suspended)
        const workerUser = await this._userRepo.findById(service.workerId);
        let suspensionStartDate = now;
        let suspensionEndDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        if (workerUser && workerUser.isSuspended && workerUser.suspensionEndDate) {
          const currentSuspensionEnd = new Date(workerUser.suspensionEndDate);
          if (currentSuspensionEnd.getTime() > now.getTime()) {
            suspensionStartDate = new Date(workerUser.suspensionStartDate ?? now);
            suspensionEndDate = new Date(currentSuspensionEnd.getTime() + 3 * 24 * 60 * 60 * 1000);
          }
        }

        await this._workerRepo.updateById(service.workerId, {
          isSuspended: true,
          suspensionStartDate,
          suspensionEndDate,
          canAcceptBookings: false,
        });

        // 3. Refund FULL amount to client (integrating with wallet, transactions, and payments)
        await this.orchestrateRefund(service.clientId, service.totalAmount, service.serviceId);

        // 4. Send Notifications
        await this.sendCase1Notifications(service, suspensionEndDate);

        case1Count++;
      } catch (err) {
        console.error(`Error processing Case 1 for service ${service.serviceId}:`, err);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CASES 2 & 3: VIDEO CALL SERVICE CHECKS
    // ─────────────────────────────────────────────────────────────────────────
    const videoCallServices = await this._serviceRepo.findPassedConfirmedVideoCalls(now);

    for (const service of videoCallServices) {
      const joinedUsers = service.videoCall?.joinedUsers ?? [];
      const clientJoined = joinedUsers.includes(service.clientId);
      const workerJoined = joinedUsers.includes(service.workerId);

      // CASE 2: WORKER MISSED VIDEO CALL
      // client joined, worker never joined
      if (clientJoined && !workerJoined) {
        try {
          // 1. Mark meeting/service as WORKER_ABSENT
          await this._serviceRepo.updateStatus(service.serviceId, {
            status: ServiceStatus.WORKER_ABSENT,
            paymentStatus: PaymentStatus.REFUNDED,
            updatedAt: now,
          });

          // 2. Suspend worker from NEW bookings for 1 day (additively if already suspended)
          const workerUser = await this._userRepo.findById(service.workerId);
          let suspensionStartDate = now;
          let suspensionEndDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

          if (workerUser && workerUser.isSuspended && workerUser.suspensionEndDate) {
            const currentSuspensionEnd = new Date(workerUser.suspensionEndDate);
            if (currentSuspensionEnd.getTime() > now.getTime()) {
              suspensionStartDate = new Date(workerUser.suspensionStartDate ?? now);
              suspensionEndDate = new Date(currentSuspensionEnd.getTime() + 1 * 24 * 60 * 60 * 1000);
            }
          }

          await this._workerRepo.updateById(service.workerId, {
            isSuspended: true,
            suspensionStartDate,
            suspensionEndDate,
            canAcceptBookings: false,
          });

          // 3. Refund FULL amount to client
          await this.orchestrateRefund(service.clientId, service.totalAmount, service.serviceId);

          // 4. Send Notifications
          await this.sendCase2Notifications(service, suspensionEndDate);

          case2Count++;
        } catch (err) {
          console.error(`Error processing Case 2 for service ${service.serviceId}:`, err);
        }
      }

      // CASE 3: CLIENT MISSED VIDEO CALL
      // worker joined, client never joined
      else if (workerJoined && !clientJoined) {
        try {
          // 1. Mark meeting/service as CLIENT_ABSENT
          await this._serviceRepo.updateStatus(service.serviceId, {
            status: ServiceStatus.CLIENT_ABSENT,
            updatedAt: now,
          });

          // 2. Suspend client from booking that worker for 1 day (additively if already restricted)
          const activeRestriction = await this._restrictionRepo.getActiveRestriction(service.clientId, service.workerId);
          let expirationDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

          if (activeRestriction) {
            expirationDate = new Date(new Date(activeRestriction.expiresAt).getTime() + 1 * 24 * 60 * 60 * 1000);
            // Delete the older restriction to replace with the extended one
            await this._restrictionRepo.delete(activeRestriction.restrictionId);
          }

          await this._restrictionRepo.create({
            restrictionId: uuidv4(),
            clientId: service.clientId,
            workerId: service.workerId,
            expiresAt: expirationDate,
            createdAt: now,
          });

          // 3. No refund to client (as per requirements)

          // 4. Send Notifications
          await this.sendCase3Notifications(service, expirationDate);

          case3Count++;
        } catch (err) {
          console.error(`Error processing Case 3 for service ${service.serviceId}:`, err);
        }
      }
    }

    return {
      case1ProcessedCount: case1Count,
      case2ProcessedCount: case2Count,
      case3ProcessedCount: case3Count,
      success: true,
      message: `Moderation checks executed successfully. Processed ${String(case1Count)} no-shows, ${String(case2Count)} worker meeting absences, ${String(case3Count)} client meeting absences.`,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // REFUND ORCHESTRATION helper
  // ───────────────────────────────────────────────────────────────────────────
  private async orchestrateRefund(clientId: string, amount: number, serviceId: string): Promise<void> {
    if (!amount || amount <= 0) return;

    // 1. Fetch or create client wallet
    let clientWallet = await this._walletRepo.findByUserId(clientId);
    clientWallet ??= await this._walletRepo.create({
      walletId: uuidv4(),
      userId: clientId,
      balance: 0,
      currency: "INR",
    });

    // 2. Credit client wallet
    const updatedClientWallet = await this._walletRepo.creditBalance(clientId, amount);

    // 3. Log CREDIT transaction for client
    await this._transactionRepo.create({
      transactionId: uuidv4(),
      walletId: updatedClientWallet.walletId,
      userId: clientId,
      type: transactionType.CREDIT,
      amount,
      source: transactionSource.REFUND,
      serviceId,
      status: transactionStatus.SUCCESS,
      createdAt: new Date(),
    });

    // 4. Debit Admin wallet (Admin holds the service payment after it is paid)
    const adminRepo = this._userRepoFactory.getRepository(Role.ADMIN);
    const admins = await adminRepo.findAll();
    const admin = admins[0];

    let adminWallet = await this._walletRepo.findByUserId(admin.userId);
    adminWallet ??= await this._walletRepo.create({
      walletId: uuidv4(),
      userId: admin.userId,
      balance: 0,
      currency: "INR",
    });

    // Debit Admin
    const updatedAdminWallet = await this._walletRepo.debitBalance(admin.userId, amount);

    // Log DEBIT transaction for Admin
    await this._transactionRepo.create({
      transactionId: uuidv4(),
      walletId: updatedAdminWallet.walletId,
      userId: admin.userId,
      type: transactionType.DEBIT,
      amount,
      source: transactionSource.REFUND,
      serviceId,
      status: transactionStatus.SUCCESS,
      createdAt: new Date(),
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // NOTIFICATION HELPERS
  // ───────────────────────────────────────────────────────────────────────────
  private async sendCase1Notifications(service: Service, suspensionEndDate: Date): Promise<void> {
    const formattedDate = suspensionEndDate.toLocaleDateString();

    // Client
    await this.notifyUser(
      service.clientId,
      "Refund Processed",
      `Your physical service booking "${service.title}" has been marked as worker no-show. A full refund of INR ${String(service.totalAmount)} has been credited to your wallet.`,
      "REFUND_NO_SHOW",
      { serviceId: service.serviceId }
    );

    // Worker
    await this.notifyUser(
      service.workerId,
      "Booking Suspension",
      `You missed the scheduled physical service "${service.title}". Your account is suspended from accepting NEW bookings until ${formattedDate}.`,
      "WORKER_SUSPENDED",
      { serviceId: service.serviceId }
    );

    // Admin
    await this.notifyAdmins(
      "Worker No-Show Moderation Action",
      `Worker (ID: ${service.workerId}) missed the physical service "${service.title}" (ID: ${service.serviceId}). Symmetrical refund of INR ${String(service.totalAmount)} processed for client (ID: ${service.clientId}). Worker suspended for 3 days.`,
      "ADMIN_MODERATION",
      { serviceId: service.serviceId, workerId: service.workerId }
    );
  }

  private async sendCase2Notifications(service: Service, suspensionEndDate: Date): Promise<void> {
    const formattedDate = suspensionEndDate.toLocaleDateString();

    // Client
    await this.notifyUser(
      service.clientId,
      "Refund Processed (Missed Meeting)",
      `The video call meeting "${service.title}" was missed by the worker. A full refund of INR ${String(service.totalAmount)} has been credited to your wallet.`,
      "REFUND_MISSED_MEETING",
      { serviceId: service.serviceId }
    );

    // Worker
    await this.notifyUser(
      service.workerId,
      "Meeting Absence Suspension",
      `You did not attend the scheduled video call "${service.title}". Your account is suspended from accepting NEW bookings until ${formattedDate}.`,
      "WORKER_SUSPENDED",
      { serviceId: service.serviceId }
    );

    // Admin
    await this.notifyAdmins(
      "Worker Absent Moderation Action",
      `Worker (ID: ${service.workerId}) missed the video call "${service.title}" (ID: ${service.serviceId}). Refund of INR ${String(service.totalAmount)} processed for client (ID: ${service.clientId}). Worker suspended for 1 day.`,
      "ADMIN_MODERATION",
      { serviceId: service.serviceId, workerId: service.workerId }
    );
  }

  private async sendCase3Notifications(service: Service, expirationDate: Date): Promise<void> {
    const formattedDate = expirationDate.toLocaleDateString();

    // Client
    await this.notifyUser(
      service.clientId,
      "Missed Meeting Booking Restriction",
      `You did not attend the scheduled video call "${service.title}". You are temporarily restricted from booking this worker until ${formattedDate}.`,
      "CLIENT_RESTRICTED",
      { serviceId: service.serviceId }
    );

    // Worker
    await this.notifyUser(
      service.workerId,
      "Client Missed Meeting Notification",
      `The client did not attend the scheduled video call "${service.title}" (ID: ${service.serviceId}). No refund was processed.`,
      "CLIENT_ABSENT",
      { serviceId: service.serviceId }
    );

    // Admin
    await this.notifyAdmins(
      "Client Absent Moderation Action",
      `Client (ID: ${service.clientId}) missed the video call "${service.title}" (ID: ${service.serviceId}). Client is restricted from booking this worker (ID: ${service.workerId}) for 1 day. No refund issued.`,
      "ADMIN_MODERATION",
      { serviceId: service.serviceId, clientId: service.clientId }
    );
  }

  private async notifyUser(userId: string, title: string, message: string, type: string, data?: Record<string, unknown>): Promise<void> {
    try {
      await this._sendNotification.execute({
        userId,
        title,
        message,
        type,
        data,
      });
    } catch (err) {
      console.error(`Failed to send notification to user ${userId}:`, err);
    }
  }

  private async notifyAdmins(title: string, message: string, type: string, data?: Record<string, unknown>): Promise<void> {
    try {
      const adminRepo = this._userRepoFactory.getRepository(Role.ADMIN);
      const admins = await adminRepo.findAll();
      for (const admin of admins) {
        await this._sendNotification.execute({
          userId: admin.userId,
          title,
          message,
          type,
          data,
        });
      }
    } catch (err) {
      console.error("Failed to send notification to admins:", err);
    }
  }
}
