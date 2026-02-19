export type ServiceStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

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
    status: ServiceStatus;
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
