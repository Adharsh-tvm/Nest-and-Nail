import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { CreateServiceRequestDTO, ServiceRequestResponseDTO } from "../dtos/ServiceRequestDTO";

export class ServiceRequestMapper {
    static toResponseDTO(
        entity: ServiceRequest
    ): ServiceRequestResponseDTO {
        return {
            requestId: entity.requestId,
            title: entity.title,
            description: entity.description,
            category: entity.category,

            location: {
                lat: entity.location.coordinates[1],
                lng: entity.location.coordinates[0]
            },

            budget: entity.budget,

            servicePhotos: entity.servicePhotos ?? [],

            status: entity.status,
            reservedBy: entity.reservedBy,
            reservationExpiresAt: entity.reservationExpiresAt,
            createdAt: entity.createdAt,
            client: entity.client ? {
                name: entity.client.name,
                email: entity.client.email,
                phone: entity.client.phone,
                profilePictureUrl: entity.client.profilePictureUrl
            } : undefined
        };
    }

    static fromCreateDTO(
        dto: CreateServiceRequestDTO,
        clientId: string
    ): CreateServiceRequestDTO & { clientId: string } {
        return {
            ...dto,
            clientId
        };
    }
}