import { ServiceResponseDTO } from "../../dtos/ServiceDTO";

export interface ICompleteServiceUseCase {
  execute(
    serviceId: string,
    workerId: string
  ): Promise<ServiceResponseDTO>;
}