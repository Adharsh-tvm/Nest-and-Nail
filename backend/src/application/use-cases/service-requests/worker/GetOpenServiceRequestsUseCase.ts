import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { IGetOpenServiceRequestsUseCase } from "../../../interfaces/service-requests/worker/IGetOpenServiceRequestsUseCase";

export class GetOpenServiceRequestsUseCase implements IGetOpenServiceRequestsUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository
    ) { }

    async execute(
        workerId: string,
        workerLocation: [number, number],
        radiusMeters?: number
    ): Promise<ServiceRequest[]> {
        return this._serviceRequestRepo.findOpenNearby(
            workerLocation,
            workerId,
            radiusMeters
        );
    }

}