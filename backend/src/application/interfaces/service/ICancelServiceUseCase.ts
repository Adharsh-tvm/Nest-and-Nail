import { ServiceResponseDTO } from "../../dtos/ServiceDTO";

export interface ICancelServiceUseCase {
  execute(
    serviceId: string,
    userId: string,
    reason?: string
  ): Promise<ServiceResponseDTO>;
}