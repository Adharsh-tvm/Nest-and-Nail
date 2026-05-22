import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetWorkerServiceDetailsUseCase {
    execute(
        serviceId: string,
        workerId: string
    ): Promise<ServiceResponseDTO>;
}