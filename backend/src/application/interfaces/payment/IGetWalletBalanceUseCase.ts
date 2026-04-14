import { Wallet } from "../../../domain/entities/Wallet";

export interface IGetWalletBalanceUseCase {
    execute(userId: string): Promise<Wallet>;
}
