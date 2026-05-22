import { Concern } from "../../../domain/entities/Concern";

export interface IResolveConcernUseCase {
  execute(concernId: string, resolutionMessage: string, adminId?: string): Promise<Concern | null>;
}
