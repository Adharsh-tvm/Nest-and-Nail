import { Worker } from "../entities/Worker";
import { IBaseRepository } from "./IBaseRepository";

export interface IWorkerRepository extends IBaseRepository<Worker> {

    findEligibleWorkers(
        category: string,
        coordinates: [number, number],
        maxDistance: number
    ): Promise<Worker[]>;

    findOnlineWorkers(): Promise<Worker[]>;

    reserveWorker(workerId: string): Promise<boolean>;

    releaseWorker(workerId: string): Promise<void>;

    incrementWeeklyJobCount(workerId: string): Promise<void>;
}