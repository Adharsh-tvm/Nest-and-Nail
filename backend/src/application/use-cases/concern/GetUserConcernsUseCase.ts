import { IConcernRepository } from "../../../domain/repositories/IConcernRepository";
import { IGetUserConcernsUseCase } from "../../interfaces/concern/IGetUserConcernsUseCase";

export class GetUserConcernsUseCase implements IGetUserConcernsUseCase {
  constructor(private readonly _concernRepo: IConcernRepository) {}

  async execute(userId: string) {
    return this._concernRepo.findByUser(userId);
  }
}