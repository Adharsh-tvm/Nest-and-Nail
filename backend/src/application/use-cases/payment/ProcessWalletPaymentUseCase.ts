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
import { IProcessWalletPaymentUseCase } from "../../interfaces/payment/IProcessWalletPaymentUseCase";
import { transactionSource, transactionStatus, transactionType } from "../../../shared/enums/transactionEnums";

export class ProcessWalletPaymentUseCase implements IProcessWalletPaymentUseCase {
  constructor(
    private readonly _paymentRepo: IPaymentRepository,
    private readonly _serviceRepo: IServiceRepository,
    private readonly _walletRepo: IWalletRepository,
    private readonly _transactionRepo: ITransactionRepository,
    private readonly _scheduleRepo: IWorkerScheduleRepository,
    private readonly _userRepoFactory: IUserRepositoryFactory
  ) {}

  async execute(serviceId: string, clientId: string) {
    const service = await this._serviceRepo.findById(serviceId);

    if (!service) throw new Error("Service not found");

    if (service.clientId !== clientId) {
      throw new Error("Unauthorized");
    }

    if (service.paymentStatus === PaymentStatus.SUCCESS) {
      throw new Error("Service is already paid");
    }

    const amount = service.totalAmount;

    let wallet = await this._walletRepo.findByUserId(clientId);

    if (!wallet) {
      wallet = await this._walletRepo.create({
        walletId: uuidv4(),
        userId: clientId,
        balance: 0,
        currency: "INR",
      });
    }

    const updatedWallet = await this._walletRepo.debitBalance(clientId, amount);

    await this._transactionRepo.create({
      transactionId: uuidv4(),
      walletId: updatedWallet.walletId,
      userId: clientId,
      type: transactionType.DEBIT,
      amount,
      source: transactionSource.SERVICE_PAYMENT,
      serviceId,
      status: transactionStatus.SUCCESS,
      createdAt: new Date(),
    });

    // Calculate platform fee and worker share
    const platformFee = service.category === "VIDEO_CALL" ? 10 : 50;
    const workerShare = amount - platformFee;

    // Credit Worker
    const workerId = service.workerId;
    let workerWallet = await this._walletRepo.findByUserId(workerId);
    if (!workerWallet) {
      workerWallet = await this._walletRepo.create({
        walletId: uuidv4(),
        userId: workerId,
        balance: 0,
        currency: "INR",
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
      serviceId,
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
            serviceId,
            status: transactionStatus.SUCCESS,
            createdAt: new Date(),
        });
    }

    await this._paymentRepo.create({
      id: uuidv4(),
      serviceId,
      clientId,
      amount,
      currency: "INR",
      orderId: `wallet_${uuidv4()}`,
      status: PaymentStatus.SUCCESS,
      createdAt: new Date(),
    });

    await this._serviceRepo.updatePaymentStatus(serviceId, PaymentStatus.SUCCESS);

    await this._serviceRepo.updateStatus(serviceId, {
      status: ServiceStatus.CONFIRMED,
    });

    // Mark worker schedule slots as booked now that payment is confirmed
    for (const slot of service.selectedSlots || []) {
      await this._scheduleRepo.markAsBooked(
        service.workerId,
        slot.date,
        slot.slotType,
        service.serviceId
      );
    }

    return {
      success: true,
      message: "Payment successful via Wallet",
      walletBalance: updatedWallet.balance,
      serviceId,
    };
  }
}