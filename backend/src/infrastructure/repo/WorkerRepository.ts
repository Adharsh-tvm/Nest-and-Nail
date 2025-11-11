import { Worker } from "../../domain/entities/Worker";
import { IWorkerRepository } from "../../domain/repositories/IWorkerRepository";
import { WorkerModel } from "../database/models/WorkerModel";
import { BaseRepository } from "./BaseRepository";

export class WorkerRepository extends BaseRepository<Worker> implements IWorkerRepository {
    constructor() {
        super(WorkerModel);
    }
}