import { ServiceRequestStatus } from "../enums/ServiceRequestStatus";

export interface ServiceRequest {
    id: string;
    title: string;
    description: string;
    category: string;
    location: {
        lat: number;
        lng: number;
    };
    budget?: number;
    servicePhotos?: string[];
    serviceDate: Date | string;
    status: ServiceRequestStatus;

    assignedTo?: string;
    triedWorkers?: string[];

    createdAt: string;
}

export interface CreateServiceRequestDTO {
    title: string;
    description: string;
    category: string;
    location: {
        lat: number;
        lng: number;
    };
    budget?: number;
    serviceDate: Date | string;
    servicePhotos?: string[];
}
