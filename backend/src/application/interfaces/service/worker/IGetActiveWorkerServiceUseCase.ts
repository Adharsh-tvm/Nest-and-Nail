import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetActiveWorkerServiceUseCase {
    execute(workerId: string): Promise<ServiceResponseDTO | null>;
}