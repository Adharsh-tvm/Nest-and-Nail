import { ServiceStatus } from "../../../../shared/enums/serviceEnums";
import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetWorkerServicesUseCase {
    execute(workerId: string, status?: ServiceStatus): Promise<ServiceResponseDTO[]>;
}