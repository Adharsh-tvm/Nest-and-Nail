import { Service } from "../entities/Service";

export interface IServiceRepository {
    create(service: Service): Promise<Service>;
    updateStatus(serviceId: string, update: Partial<Service>): Promise<Service | null>;
    findById(serviceId: string): Promise<Service | null>;
    findByClientId(clientId: string): Promise<Service[]>;
    findByWorkerId(workerId: string): Promise<Service[]>;
    findActiveByWorkerId(workerId: string): Promise<Service | null>;
}