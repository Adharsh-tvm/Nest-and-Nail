import { IGetTransactionsUseCase } from "../../interfaces/payment/IGetTransactionsUseCase";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";

export class GetTransactionsUseCase implements IGetTransactionsUseCase {
  constructor(
    private readonly _transactionRepository: ITransactionRepository
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    return this._transactionRepository.findByUserId(userId, page, limit);
  }
}