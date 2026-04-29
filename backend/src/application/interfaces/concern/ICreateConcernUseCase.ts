import { Concern } from "../../../domain/entities/Concern";
import { concernBy } from "../../../shared/enums/concernEnums";

export interface ICreateConcernUseCase {
  execute(
    serviceId: string,
    userId: string,
    role: concernBy,
    message: string
  ): Promise<Concern>;
}