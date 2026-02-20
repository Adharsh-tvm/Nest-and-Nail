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
  serviceDate: string | Date;

  status: ServiceRequestStatus;

  assignedTo?: string;
  triedWorkers?: string[];

  reservedBy?: string;
  reservationExpiresAt?: Date;

  createdAt: string;

  client?: {
    name: string;
    email: string;
    phone?: number;
    profilePictureUrl?: string;
  }
}