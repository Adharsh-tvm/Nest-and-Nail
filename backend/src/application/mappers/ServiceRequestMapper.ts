import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { ServiceRequestResponseDTO } from "../dtos/ServiceRequestDTO";

export class ServiceRequestMapper {
    static toResponseDTO(
        entity: ServiceRequest
    ): ServiceRequestResponseDTO {
        return {
            requestId: entity.id,
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
            createdAt: entity.createdAt
        };
    }

    static fromCreateDTO(
        dto: {
            title: string,
            description: string;
            category: string;
            location: { lat: number; lng: number };
            budget?: number;
            servicePhotos?: string[];
        },
        clientId: string
    ): Partial<ServiceRequest> {
        return {
            clientId,
            title: dto.title,
            description: dto.description,
            category: dto.category,
            location: {
                type: "Point",
                coordinates: [dto.location.lng, dto.location.lat]
            },
            budget: dto.budget,

            servicePhotos: dto.servicePhotos ?? []
        };
    }
}