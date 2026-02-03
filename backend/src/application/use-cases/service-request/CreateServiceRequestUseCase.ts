import { ServiceRequest } from "../../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";
import { IGenerateServiceRequestId } from "../../contracts/IGenerateServiceRequestId";
import { ICreateServiceRequestUseCase } from "../../interfaces/service-request/ICreateServiceRequestUseCase ";

export class CreateServiceRequestUseCase implements ICreateServiceRequestUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository,
        private readonly _idGenerator: IGenerateServiceRequestId
    ) { }

    async execute(data: Omit<ServiceRequest, "id" | "requestId" | "status" | "reservedBy" | "reservationExpiresAt" | "createdAt" | "updatedAt">): Promise<ServiceRequest> {

        const requestId = this._idGenerator.generate();

        return this._serviceRequestRepo.create({
            ...data,
            requestId,
            status: ServiceRequestStatus.OPEN
        });
    }
}