import { IResolveConcernUseCase } from "../../interfaces/concern/IResolveConcernUseCase";
import { IConcernRepository } from "../../../domain/repositories/IConcernRepository";
import { Concern } from "../../../domain/entities/Concern";
import { concernStatus } from "../../../shared/enums/concernEnums";

export class ResolveConcernUseCase implements IResolveConcernUseCase {
  constructor(private readonly _concernRepo: IConcernRepository) {}

  async execute(concernId: string, resolutionMessage: string, adminId?: string): Promise<Concern | null> {
    if (!concernId) {
      throw new Error("Concern ID is required");
    }
    if (!resolutionMessage || resolutionMessage.trim().length === 0) {
      throw new Error("Resolution message is required to resolve a concern");
    }

    const concern = await this._concernRepo.findById(concernId);
    if (!concern) {
      throw new Error("Concern not found");
    }

    if (concern.status === concernStatus.RESOLVED) {
      throw new Error("Concern is already resolved");
    }

    const updatedConcern = await this._concernRepo.update(concernId, {
      status: concernStatus.RESOLVED,
      resolutionMessage: resolutionMessage.trim(),
      resolvedAt: new Date(),
      resolvedBy: adminId ?? "ADMIN",
    });

    return updatedConcern;
  }
}
