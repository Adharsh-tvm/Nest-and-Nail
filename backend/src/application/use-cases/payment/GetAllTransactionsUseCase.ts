import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IGetAllTransactionsUseCase } from "../../interfaces/payment/IGetAllTransactionsUseCase";

export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  constructor(
    private readonly _transactionRepository: ITransactionRepository
  ) {}

  async execute(page: number, limit: number) {
    return this._transactionRepository.findAll(page, limit);
  }
}