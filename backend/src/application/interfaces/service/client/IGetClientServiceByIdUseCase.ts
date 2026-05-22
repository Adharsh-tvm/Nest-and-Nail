import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetClientServiceByIdUseCase {
  execute(serviceId: string, clientId: string): Promise<ServiceResponseDTO>;
}