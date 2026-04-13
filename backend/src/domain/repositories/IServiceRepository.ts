import { UpdateVideoCallDTO } from "../../application/dtos/videoCallDTO";
import { Service } from "../entities/Service";

export interface IServiceRepository {
    create(service: Service): Promise<Service>;
    updateStatus(serviceId: string, update: Partial<Service>): Promise<Service | null>;
    findById(serviceId: string): Promise<Service | null>;
    findByClientId(clientId: string): Promise<Service[]>;
    findByWorkerId(workerId: string): Promise<Service[]>;
    findActiveByWorkerId(workerId: string): Promise<Service | null>;
    findAllWithDetails(): Promise<any[]>;
    findDetailedByServiceId(serviceId: string): Promise<any | null>;
    getMeetingsByClient(clientId: string): Promise<Service[]>;
    getMeetingsByWorker(workerId: string): Promise<Service[]>;
    updateVideoCall(serviceId: string, videoCall: UpdateVideoCallDTO): Promise<any>;
    updatePaymentStatus(serviceId: string, paymentStatus: string): Promise<void>;
}    