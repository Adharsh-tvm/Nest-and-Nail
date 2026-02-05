import { ServiceRequest } from "../../../domain/entities/ServiceRequest";


export interface IGetServiceRequestByIdUseCase {
  execute(requestId: string, userId: string): Promise<ServiceRequest>;
}
