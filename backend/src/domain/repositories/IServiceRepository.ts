import { Service } from "../entities/Service";

export interface IServiceRepository {
    create(service: Service): Promise<Service>;
    updateStatus(serviceId: string, update: Partial<Service>): Promise<Service | null>;
    findById(serviceId: string): Promise<Service | null>;
}