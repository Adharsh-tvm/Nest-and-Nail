import { Worker } from "../../../domain/entities/Worker";
import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";

export interface IGetWorkerByIdUseCase {
  execute(id: string): Promise<Worker | null>;
}

export class GetWorkerByIdUseCase implements IGetWorkerByIdUseCase {
  constructor(private readonly workerRepository: IWorkerRepository) {}

  async execute(id: string): Promise<Worker | null> {
    return this.workerRepository.findById(id);
  }
}
