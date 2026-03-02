import { Worker } from "../../../domain/entities/Worker";

export interface IGetOnlineWorkersUseCase {
    execute(): Promise<Worker[]>;
}
