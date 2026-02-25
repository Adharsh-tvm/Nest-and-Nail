import { Service } from "../entities/Service";

export interface IServiceRepository {
  create(data: Partial<Service>): Promise<Service>;

  findByServiceId(serviceId: string): Promise<Service | null>;

  findByWorkerId(workerId: string): Promise<Service[]>;

  findByClientId(clientId: string): Promise<Service[]>;

  updateByServiceId(
    serviceId: string,
    updateData: Partial<Service>
  ): Promise<Service | null>;

  confirmReservation(
    requestId: string,
    workerId: string
  ): Promise<boolean>;

  delete(serviceId: string): Promise<boolean>;
}