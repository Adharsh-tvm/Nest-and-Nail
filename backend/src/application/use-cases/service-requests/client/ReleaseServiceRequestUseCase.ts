import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { IReleaseServiceRequestUseCase } from "../../../interfaces/service-requests/client/IReleaseServiceRequestUseCase";

export class ReleaseServiceRequestUseCase implements IReleaseServiceRequestUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository
    ) { }

    async execute(requestId: string): Promise<void> {
        await this._serviceRequestRepo.releaseReservationByRequestId(
            requestId
        );
    }
}