import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetWorkerMeetingsHistoryUseCase {
    execute(workerId: string): Promise<ServiceResponseDTO[]>;
}