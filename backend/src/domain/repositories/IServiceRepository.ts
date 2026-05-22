import { UpdateVideoCallDTO } from "../../application/dtos/videoCallDTO";
import { Service } from "../entities/Service";

export interface IServiceRepository {

    create(service: Service): Promise<Service>;
    updateStatus(serviceId: string, update: Partial<Service>): Promise<Service | null>;

    findById(serviceId: string): Promise<Service | null>;
    findByClientId(clientId: string): Promise<Service[]>;
    findByWorkerId(workerId: string): Promise<Service[]>;
    findActiveByWorkerId(workerId: string): Promise<Service | null>;

    findAllWithDetails(): Promise<unknown[]>;
    findDetailedByServiceId(serviceId: string): Promise<unknown>;

    getMeetingsByClient(clientId: string): Promise<Service[]>;
    getMeetingsByWorker(workerId: string): Promise<Service[]>;
    updateVideoCall(serviceId: string, videoCall: UpdateVideoCallDTO): Promise<unknown>;
    getAllMeetingsForAdmin(query: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
    }): Promise<unknown>;
    getMeetingByIdForAdmin(serviceId: string): Promise<unknown>;

    updatePaymentStatus(serviceId: string, paymentStatus: string): Promise<void>;

    cancelService(
        serviceId: string,
        data: { cancelledAt: Date; reason?: string }
    ): Promise<void>;

    findPassedConfirmedPhysicalServices(now: Date): Promise<Service[]>;
    findPassedConfirmedVideoCalls(now: Date): Promise<Service[]>;
}    