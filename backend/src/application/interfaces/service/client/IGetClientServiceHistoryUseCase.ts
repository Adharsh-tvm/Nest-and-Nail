import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetClientServiceHistoryUseCase {
  execute(clientId: string): Promise<ServiceResponseDTO[]>;
}