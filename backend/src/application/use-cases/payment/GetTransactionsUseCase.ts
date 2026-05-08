import { IGetTransactionsUseCase } from "../../interfaces/payment/IGetTransactionsUseCase";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";

export class GetTransactionsUseCase implements IGetTransactionsUseCase {
  constructor(
    private readonly _transactionRepository: ITransactionRepository
  ) {}

  async execute(userId: string, page = 1, limit = 10) {
    return this._transactionRepository.findByUserId(userId, page, limit);
  }
}