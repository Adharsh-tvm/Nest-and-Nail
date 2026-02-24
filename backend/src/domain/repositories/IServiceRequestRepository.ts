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

  reserveRequest(
    requestId: string,
    workerId: string,
    expiresAt: Date
  ): Promise<boolean>;

  addTriedWorker(
    requestId: string,
    workerId: string
  ): Promise<void>;

  markNoWorkersAvailable(requestId: string): Promise<void>;

  findExpiredReservations(currentTime: Date): Promise<ServiceRequest[]>;

  delete(requestId: string): Promise<boolean>;
}
