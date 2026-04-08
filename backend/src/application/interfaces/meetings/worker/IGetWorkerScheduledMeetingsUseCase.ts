import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetWorkerScheduledMeetingsUseCase {
    execute(workerId: string): Promise<ServiceResponseDTO[]>;
}