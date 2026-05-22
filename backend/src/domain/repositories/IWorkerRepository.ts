import { Worker } from "../entities/Worker";
import { IBaseRepository } from "./IBaseRepository";

export interface IWorkerRepository extends IBaseRepository<Worker> {

    findAvailableWorkers(
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