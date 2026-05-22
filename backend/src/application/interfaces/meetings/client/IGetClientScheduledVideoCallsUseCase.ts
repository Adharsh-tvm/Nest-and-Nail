import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetClientScheduledMeetingsUseCase {
    execute(clientId: string): Promise<ServiceResponseDTO[]>;
}