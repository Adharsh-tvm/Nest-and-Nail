import { CreateServiceDTO, ServiceResponseDTO } from "../../application/dtos/ServiceDTO";

export interface IBookWorkerUseCase {
  execute(data: CreateServiceDTO): Promise<ServiceResponseDTO>;
}