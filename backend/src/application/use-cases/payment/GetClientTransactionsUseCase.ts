import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IGetClientTransactionsUseCase } from "../../interfaces/payment/IGetClientTransactionsUseCase";

export class GetClientTransactionsUseCase implements IGetClientTransactionsUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository
    ) { }

    async execute(userId: string, page: number, limit: number) {
        return this._transactionRepository.findByUserId(userId, page, limit);
    }
}