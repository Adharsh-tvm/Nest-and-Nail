import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { IReserveServiceRequestUseCase } from "../../interfaces/service-requests/worker/IReserveServiceRequestUseCase ";

export class ReserveServiceRequestUseCase implements IReserveServiceRequestUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository
    ) { }

    async execute(requestId: string, workerId: string): Promise<{ reservedUntil: Date; }> {

        const expiresAt = new Date(
            Date.now() + 60 * 60 * 1000
        );

        const success = await this._serviceRequestRepo.reserveByRequestId(
            requestId,
            workerId,
            expiresAt
        );

        if (!success) {
            throw new Error("Service request is no longer available");
        }

        return {
            reservedUntil: expiresAt
        }
    }
} 