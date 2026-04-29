import { Concern } from "../../../domain/entities/Concern";

export interface IGetUserConcernsUseCase {
  execute(userId: string): Promise<Concern[]>;
}