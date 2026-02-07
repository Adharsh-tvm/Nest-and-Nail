import { ServiceRequest } from "../entities/ServiceRequest";

export interface IServiceRequestRepository {
  create(data: Partial<ServiceRequest>): Promise<ServiceRequest>;

  findOpenNearby(
    coordinates: [number, number],
    workerId: string,
    radiusMeters?: number
  ): Promise<ServiceRequest[]>;

  findByRequestId(
    requestId: string
  ): Promise<ServiceRequest | null>;

  reserveByRequestId(
    requestId: string,
    workerId: string,
    expiresAt: Date
  ): Promise<boolean>;

  releaseReservationByRequestId(
    requestId: string
  ): Promise<void>;

  findByClientId(
    clientId: string
  ): Promise<ServiceRequest[]>;

}
