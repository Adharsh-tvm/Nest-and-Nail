import { IPaymentGateway } from "../../../domain/gateways/IPaymentGateway";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { v4 as uuidv4 } from "uuid";
import { transactionSource, transactionStatus, transactionType } from "../../../shared/enums/transactionEnums";

export interface IVerifyRechargePaymentUseCase {
    execute(data: {
        orderId: string;
        paymentId: string;
        signature: string;
        userId: string;
        amount: number;
    }): Promise<{ success: boolean; newBalance: number }>;
}

export class VerifyRechargePaymentUseCase implements IVerifyRechargePaymentUseCase {
    constructor(
        private readonly _paymentGateway: IPaymentGateway,
        private readonly _walletRepo: IWalletRepository,
        private readonly _transactionRepo: ITransactionRepository
    ) {}

    async execute(data: {
        orderId: string;
        paymentId: string;
        signature: string;
        userId: string;
        amount: number;
    }) {
        const isValid = this._paymentGateway.verifyPayment({
            orderId: data.orderId,
            paymentId: data.paymentId,
            signature: data.signature,
        });

        if (!isValid) throw new Error("Invalid payment signature");

        let wallet = await this._walletRepo.findByUserId(data.userId);
        wallet ??= await this._walletRepo.create({
            walletId: uuidv4(),
            userId: data.userId,
            balance: 0,
            currency: "INR",
        });

        const updatedWallet = await this._walletRepo.creditBalance(data.userId, data.amount);

        await this._transactionRepo.create({
            transactionId: data.paymentId, // use paymentId as transactionId to prevent replays naturally if DB enforce unique
            walletId: updatedWallet.walletId,
            userId: data.userId,
            type: transactionType.CREDIT,
            amount: data.amount,
            source: transactionSource.RAZORPAY,
            status: transactionStatus.SUCCESS,
            createdAt: new Date(),
        });

        return { success: true, newBalance: updatedWallet.balance };
    }
}
