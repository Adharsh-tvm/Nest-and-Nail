import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";

export interface IGetMyServiceRequestsUseCase {
  execute(clientId: string): Promise<ServiceRequest[]>;
}
