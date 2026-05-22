import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetClientMeetingsHistoryUseCase {
    execute(clientId: string): Promise<ServiceResponseDTO[]>;
}