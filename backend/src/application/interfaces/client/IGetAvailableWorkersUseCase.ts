import { Worker } from "../../../domain/entities/Worker";

export interface IGetAvailableWorkersUseCase {
  execute(
    categoryId?: string,
    lat?: number,
    lng?: number
  ): Promise<Worker[]>;
}