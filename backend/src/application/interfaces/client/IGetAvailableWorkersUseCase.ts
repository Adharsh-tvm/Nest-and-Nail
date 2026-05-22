import { Worker } from "../../../domain/entities/Worker";

export interface IGetAvailableWorkersUseCase {
  execute(
    categoryId?: string,
    lat?: number,
    lng?: number,
    search?: string,
    isOnline?: boolean,
    page?: number,
    limit?: number,
    sortBy?: string
  ): Promise<{ workers: Worker[]; total: number }>;
}