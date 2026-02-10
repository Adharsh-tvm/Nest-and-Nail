import { ServiceRequestStatus } from "../../shared/enums/serviceEnums";

export interface ServiceRequest {
  id: string;
  requestId: string;

  clientId: string;

  title: string;
  description: string;
  category: string;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  budget?: number;

  servicePhotos?: string[];

  status: ServiceRequestStatus;

  reservedBy?: string;
  reservationExpiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  client?: {
    name: string;
    email: string;
    phone?: number;
    profilePictureUrl?: string;
  }
}
