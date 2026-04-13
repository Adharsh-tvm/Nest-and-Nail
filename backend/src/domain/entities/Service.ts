import { PaymentStatus } from "../../shared/enums/paymentEnums";
import { ServiceStatus, VideoCallStatus } from "../../shared/enums/serviceEnums";
import { SlotType } from "../../shared/enums/slotEnums";

export interface Service {
  id: string;
  serviceId: string;

  clientId: string;
  workerId: string;

  category: string;

  title: string;
  description: string;

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

  scheduledDate: Date;
  selectedSlots: {
    date: Date;
    slotType: SlotType;
  }[];

  numberOfDays: number;

  numberOfWorkers: number;

  advanceAmount?: number;

  pricePerWorker: number;

  totalAmount: number;

  bufferDay?: boolean;

  agreedBudget?: number;

  status: ServiceStatus;

  paymentStatus: PaymentStatus;

  startedAt?: Date;
  completedAt?: Date;

  cancelledAt?: Date;
  cancellationReason?: string;

  rating?: number;
  review?: string;

  videoCall?: {
    roomId: string;
    startTime: Date;
    endTime: Date;
    meetingLink?: string;

    status?: VideoCallStatus
    joinedUsers?: string[];

    startedAt?: Date;
    endedAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}