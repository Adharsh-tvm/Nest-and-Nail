import { Worker } from "../../../domain/entities/Worker";

export interface IGetAvailableWorkersUseCase {
  execute(
    categoryId?: string,
    lat?: number,
    lng?: number,
    search?: string,    // name keyword
    isOnline?: boolean  // availability filter
  ): Promise<Worker[]>;
} 