import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IGetOnlineWorkersUseCase } from "../../interfaces/worker/IGetOnlineWorkersUseCase";

export class GetOnlineWorkersUseCase implements IGetOnlineWorkersUseCase {
    constructor(private readonly _workerRepository: IWorkerRepository) { }

    async execute(): Promise<Worker[]> {
        return await this._workerRepository.findOnlineWorkers();
    }
}
