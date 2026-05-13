import { ServiceResponseDTO } from "../../../dtos/ServiceDTO";

export interface IGetWorkerMeetingByIdUseCase {
  execute(serviceId: string, workerId: string): Promise<ServiceResponseDTO>;
}