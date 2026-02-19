import { ServiceRequest } from "../../../../domain/entities/ServiceRequest";
import { IServiceRequestRepository } from "../../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestStatus } from "../../../../shared/enums/serviceEnums";
import { IGenerateServiceRequestId } from "../../../contracts/IGenerateServiceRequestId";
import { CreateServiceRequestDTO } from "../../../dtos/ServiceRequestDTO";
import { ICreateServiceRequestUseCase } from "../../../interfaces/service-requests/client/ICreateServiceRequestUseCase ";

import { IClientRepository } from "../../../../domain/repositories/IClientRepository";

export class CreateServiceRequestUseCase implements ICreateServiceRequestUseCase {
    constructor(
        private readonly _serviceRequestRepo: IServiceRequestRepository,
        private readonly _idGenerator: IGenerateServiceRequestId,
        private readonly _clientRepo: IClientRepository
    ) { }

    async execute(
        data: CreateServiceRequestDTO & { clientId: string }
    ): Promise<ServiceRequest> {

        if (!data.title || data.title.trim().length <= 5) {
            throw new Error("Title must have more than 5 words.");
        }

        if (!data.description || data.description.trim().length <= 5) {
            throw new Error("Description must have more than 5 words.");
        }

        if (data.budget !== undefined && data.budget <= 500) {
            throw new Error("Budget must be more than 500.");
        }

        const client = await this._clientRepo.findById(data.clientId);
        if (!client) {
            throw new Error("Client not found");
        }

        const requestId = this._idGenerator.generate();

        return this._serviceRequestRepo.create({
            clientId: data.clientId,
            title: data.title,
            description: data.description,
            category: data.category,
            serviceDate: data.serviceDate,
            location: {
                type: "Point",
                coordinates: [data.location.lng, data.location.lat]
            },
            budget: data.budget,
            servicePhotos: data.servicePhotos ?? [],
            requestId,
            status: ServiceRequestStatus.OPEN,
            client: {
                name: client.name,
                email: client.email,
                phone: client.phone,
                profilePictureUrl: client.profilePictureUrl
            }
        });
    }
}