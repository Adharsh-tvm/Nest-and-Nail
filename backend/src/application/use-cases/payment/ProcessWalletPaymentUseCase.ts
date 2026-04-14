import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { WalletTransactionModel } from "../../../infrastructure/database/models/WalletTransactionModel";
import { PaymentStatus } from "../../../shared/enums/paymentEnums";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { v4 as uuidv4 } from "uuid";
import { IProcessWalletPaymentUseCase } from "../../interfaces/payment/IProcessWalletPaymentUseCase";

export class ProcessWalletPaymentUseCase implements IProcessWalletPaymentUseCase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private serviceRepo: IServiceRepository,
    private walletRepo: IWalletRepository
  ) { }

  async execute(serviceId: string, clientId: string) {
    const service = await this.serviceRepo.findById(serviceId);
    if (!service) {
      throw new Error("Service not found");
    }

    if (service.clientId !== clientId) {
      throw new Error("Unauthorized");
    }

    if (service.paymentStatus === PaymentStatus.SUCCESS) {
      throw new Error("Service is already paid");
    }

    const amount = service.totalAmount;

    // Fetch or auto-create wallet
    let wallet = await this.walletRepo.findByUserId(clientId);
    if (!wallet) {
      wallet = await this.walletRepo.create({
        walletId: uuidv4(),
        userId: clientId,
        balance: 0,
        currency: "INR",
      });
    }

    const currentBalance = wallet.balance;

    if (currentBalance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    // Atomically debit the wallet
    const updatedWallet = await this.walletRepo.debitBalance(clientId, amount);
    const updatedBalance = updatedWallet?.balance ?? currentBalance - amount;

    await WalletTransactionModel.create({
      transactionId: uuidv4(),
      userId: clientId,
      amount,
      type: "DEBIT",
      description: `Payment for service ${serviceId}`,
    });

    // Record payment
    await this.paymentRepo.create({
      id: uuidv4(),
      serviceId,
      clientId,
      amount,
      currency: "INR",
      orderId: `wallet_${uuidv4()}`,
      status: PaymentStatus.SUCCESS,
      createdAt: new Date(),
    });

    await this.serviceRepo.updatePaymentStatus(serviceId, PaymentStatus.SUCCESS);
    await this.serviceRepo.updateStatus(serviceId, {
      status: ServiceStatus.CONFIRMED,
    });

    return {
      success: true,
      message: "Payment successful via Wallet",
      walletBalance: updatedBalance,
      serviceId
    };
  }
}
