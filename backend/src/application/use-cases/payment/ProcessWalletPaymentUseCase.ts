import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";

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
    private readonly _transactionRepo: ITransactionRepository 
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

    return {
      success: true,
      message: "Payment successful via Wallet",
      walletBalance: updatedWallet.balance,
      serviceId,
    };
  }
}