import { Request, Response } from "express";
import { IGetWalletBalanceUseCase } from "../../../application/interfaces/payment/IGetWalletBalanceUseCase";

export class WalletController {
    constructor(
        private getWalletBalanceUseCase: IGetWalletBalanceUseCase
    ) {}

    getBalance = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const wallet = await this.getWalletBalanceUseCase.execute(userId);
            res.status(200).json({
                success: true,
                walletId: wallet.walletId,
                userId: wallet.userId,
                balance: wallet.balance,
                currency: wallet.currency,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch wallet balance",
            });
        }
    };
}
