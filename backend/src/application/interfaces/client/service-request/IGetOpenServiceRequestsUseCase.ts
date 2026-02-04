import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";


export interface IGetOpenServiceRequestsUseCase {
    execute(
        workerLocation: [number, number],
        radiusMeters?: number
    ): Promise<ServiceRequest[]>;
}
