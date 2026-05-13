import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetClientMeetingByIdUseCase {
  execute(serviceId: string, clientId: string): Promise<ServiceResponseDTO>;
}