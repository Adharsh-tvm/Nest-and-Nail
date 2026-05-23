import { PaymentStatus } from "../../shared/enums/paymentEnums";
import { ServiceStatus } from "../../shared/enums/serviceEnums";
import { SlotType } from "../../shared/enums/slotEnums";

export interface CreateServiceDTO {
  serviceId?: string;
  clientId: string;
  workerId: string;
  category: string;

  scheduledDate: Date;
  selectedSlots: { date: Date; slotType: SlotType }[];

  numberOfDays?: number;
  numberOfWorkers: number;

  pricePerWorker: number;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    label?: string;
  };

  title?: string;
  description?: string;
  isMeetings?: boolean;
}

export interface ServiceResponseDTO {
  serviceId: string;

  clientId: string;
  workerId: string;

  category: string;

  scheduledDate: Date;
  selectedSlots: { date: Date; slotType: SlotType }[];

  status: ServiceStatus;
  paymentStatus: PaymentStatus;

  pricePerWorker: number;
  totalAmount: number;
  createdAt: Date;

  client?: {
    name: string;
    email: string;
    phone?: number;
    profilePictureUrl?: string;
  };
  worker?: {
    name: string;
    email?: string;
    rating?: number;
    profilePictureUrl?: string;
  };
  location?: {
    type: "Point";
    coordinates: number[];
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    label?: string;
  };
  title?: string;
  description?: string;
  numberOfDays?: number;
  numberOfWorkers?: number;

  videoCall?: {
    roomId: string;
    // Booked times (set at booking creation)
    startTime: Date;
    endTime: Date;
    meetingLink?: string;
    status?: string;
    // Actual times (recorded during live session)
    actualStartTime?: Date;   // First-join time, never cleared
    startedAt?: Date | null;  // Rolling segment tracker
    endedAt?: Date;
    duration?: string;
    accumulatedDuration?: number;
  };

  review?: {
    rating: number;
    review?: string;
    createdAt?: Date | string;
  };
}

export interface AdminServiceResponseDTO {
  serviceId: string;
  category: string;
  status: string;
  paymentStatus: string;

  pricePerWorker: number;
  totalAmount: number;

  scheduledDate: Date;
  selectedSlots: { date: Date; slotType: string }[];

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  client: {
    userId: string;
    name: string;
    email: string;
  };

  worker: {
    userId: string;
    name: string;
    rating?: number;
  };

  createdAt: Date;
  videoCall?: {
    roomId: string;
    // Booked times (set at booking creation)
    startTime: Date;
    endTime: Date;
    meetingLink?: string;
    status?: string;
    // Actual times (recorded during live session)
    actualStartTime?: Date;   // First-join time, never cleared
    startedAt?: Date | null;  // Rolling segment tracker
    endedAt?: Date;
    duration?: string;
    accumulatedDuration?: number;
  };
}