import { ServiceRequestStatus } from "../../shared/enums/serviceEnums";

export interface CreateServiceRequestDTO {
    title: string;
    description: string;
    category: string;
    location: {
        lat: number;
        lng: number;
    };
    budget?: number;
    servicePhotos?: string[];
}

export interface ServiceRequestResponseDTO {
  requestId: string;
  title: string;
  description: string;
  category: string;

  location: {
    lat: number;
    lng: number;
  };

  budget?: number;
  servicePhotos?: string[];

  status: ServiceRequestStatus;

  reservedBy?: string;
  reservationExpiresAt?: Date;

  createdAt: Date;
}