import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { IGetAvailableWorkersUseCase } from "../../interfaces/client/IGetAvailableWorkersUseCase";

export class GetAvailableWorkersUseCase implements IGetAvailableWorkersUseCase{

  constructor(
    private readonly workerRepository: IWorkerRepository
  ) {}

  async execute(
    categoryId?: string,
    lat?: number,
    lng?: number
  ): Promise<Worker[]> {

    return this.workerRepository.findAvailableWorkers(
      categoryId,
      lat,
      lng
    );

  }
}