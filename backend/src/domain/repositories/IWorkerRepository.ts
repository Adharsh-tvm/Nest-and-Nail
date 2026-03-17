import { Worker } from "../entities/Worker";
import { IBaseRepository } from "./IBaseRepository";

export interface IWorkerRepository extends IBaseRepository<Worker> {

    findAvailableWorkers(
        categoryId?: string,
        lat?: number,
        lng?: number,
        search?: string,      // filter by worker name (partial match)
        isOnline?: boolean    // filter by online status
    ): Promise<Worker[]>;

}