import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";

export interface IGetAllServiceRequestsUseCase {
  execute(): Promise<ServiceRequest[]>;
}
