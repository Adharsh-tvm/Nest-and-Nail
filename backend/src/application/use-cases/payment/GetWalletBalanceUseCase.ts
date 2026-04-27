import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet";
import { IGetWalletBalanceUseCase } from "../../interfaces/payment/IGetWalletBalanceUseCase";
import { v4 as uuidv4 } from "uuid";

export class GetWalletBalanceUseCase implements IGetWalletBalanceUseCase {
    constructor(private walletRepo: IWalletRepository) {}

    async execute(userId: string): Promise<Wallet> {
        let wallet = await this.walletRepo.findByUserId(userId);

        if (!wallet) {
            wallet = await this.walletRepo.create({
                walletId: uuidv4(),
                userId,
                balance: 0,
                currency: "INR",
            });
        }

        return wallet;
    }
}
