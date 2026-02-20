import { ServiceRequest } from "../entities/ServiceRequest";

export interface IServiceRequestRepository {
  create(data: Partial<ServiceRequest>): Promise<ServiceRequest>;

  findByRequestId(
    requestId: string
  ): Promise<ServiceRequest | null>;

  findByClientId(
    clientId: string
  ): Promise<ServiceRequest[]>;

  findAll(): Promise<ServiceRequest[]>;

  delete(requestId: string): Promise<boolean>;

}
