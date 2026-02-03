import { ServiceRequest } from "../../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../../shared/enums/serviceEnums";
import { IGenerateServiceRequestId } from "../../contracts/IGenerateServiceRequestId";
import { CreateServiceRequestDTO } from "../../dtos/ServiceRequestDTO";
import { ICreateServiceRequestUseCase } from "../../interfaces/service-request/ICreateServiceRequestUseCase ";

export class CreateServiceRequestUseCase implements ICreateServiceRequestUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository,
        private readonly _idGenerator: IGenerateServiceRequestId
    ) { }

    async execute(
        data: CreateServiceRequestDTO & { clientId: string }
    ): Promise<ServiceRequest> {

        const requestId = this._idGenerator.generate();

        return this._serviceRequestRepo.create({
            clientId: data.clientId,
            title: data.title,
            description: data.description,
            category: data.category,
            location: {
                type: "Point",
                coordinates: [data.location.lng, data.location.lat]
            },
            budget: data.budget,
            servicePhotos: data.servicePhotos ?? [],
            requestId,
            status: ServiceRequestStatus.OPEN
        });
    }
}