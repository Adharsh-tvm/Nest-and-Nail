import { ServiceRequestStatus } from "../../shared/enums/serviceEnums";

export interface CreateServiceRequestDTO {
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  serviceDate: Date;
  budget?: number;
  servicePhotos?: string[];
}

export interface ServiceRequestResponseDTO {
  requestId: string;
  title: string;
  description: string;
  category: string;
  serviceDate: Date;

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
  client?: {
    name: string;
    email: string;
    phone?: number;
    profilePictureUrl?: string;
  }
}