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

  updateByRequestId(
    requestId: string,
    updateData: Partial<ServiceRequest>
  ): Promise<ServiceRequest | null>;

  delete(requestId: string): Promise<boolean>;

}
