import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetClientOngoingServicesUseCase {
  execute(clientId: string): Promise<ServiceResponseDTO[]>;
}