import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";


export interface IGetOpenServiceRequestsUseCase {
    execute(
        workerId: string,
        workerLocation: [number, number],
        radiusMeters?: number
    ): Promise<ServiceRequest[]>;
}
