
import { v4 as uuidv4 } from "uuid";
import { IAcceptServiceRequestUseCase } from "../../../interfaces/service-requests/worker/IAcceptServiceRequestUseCase";
import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { IWorkerRepository } from "../../../../domain/repositories/IWorkerRepository";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { DomainError } from "../../../../domain/errors/DomainError";
import { ServiceRequestStatus } from "../../../../shared/enums/serviceEnums";
import { PaymentStatus } from "../../../../shared/enums/paymentStatus";

export class AcceptServiceRequestUseCase implements IAcceptServiceRequestUseCase {
    constructor(
        private _requestRepo: IServiceRequestRepository,
        private _workerRepo: IWorkerRepository,
        private _serviceRepo: IServiceRepository
    ) { }

    async execute(requestId: string, workerId: string): Promise<void> {

        const request = await this._requestRepo.findByRequestId(requestId);

        if (!request) {
            throw new DomainError("Service request not found", "REQUEST_NOT_FOUND");
        }

        if (request.status !== ServiceRequestStatus.OPEN) {
            throw new DomainError(
                "Service request is not open",
                "INVALID_REQUEST_STATUS"
            );
        }

        if (request.reservedBy !== workerId) {
            throw new DomainError(
                "This request is not reserved for you",
                "NOT_RESERVED_FOR_WORKER"
            );
        }

        if (!request.reservationExpiresAt || request.reservationExpiresAt < new Date()) {
            throw new DomainError(
                "Reservation has expired",
                "RESERVATION_EXPIRED"
            );
        }

        const serviceId = `SRV-${uuidv4()}`;

        await this._serviceRepo.create({
            serviceId,
            serviceRequestId: request.requestId,

            clientId: request.clientId,
            workerId,

            category: request.category,

            title: request.title,
            description: request.description,

            location: request.location,

            scheduledDate: request.serviceDate,

            agreedBudget: request.budget,

            status: ServiceRequestStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PENDING,
        });

        await this._requestRepo.updateByRequestId(requestId, {
            status: ServiceRequestStatus.CONFIRMED,
            reservedBy: undefined,
            reservationExpiresAt: undefined,
        });

        await this._workerRepo.updateById(workerId, {
            isAvailable: false,
            currentActiveRequestId: requestId,
            lastAssignedAt: new Date(),
        });

        await this._workerRepo.incrementWeeklyJobCount(workerId);
    }
}