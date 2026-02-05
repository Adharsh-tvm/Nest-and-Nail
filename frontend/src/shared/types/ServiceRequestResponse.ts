import { ServiceRequestStatus } from "../enums/ServiceRequestStatus";


export type ServiceRequestResponse = {
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

  createdAt: string; 
}