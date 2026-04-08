import { Worker } from "../../../domain/entities/Worker";

export interface IGetWorkerByIdUseCase {
  execute(id: string): Promise<Worker | null>;
}
