import { PaymentStatus } from "../../shared/enums/paymentStatus";
import { ServiceStatus } from "../../shared/enums/serviceEnums";
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

  scheduledDate: Date;
  selectedSlots: {
    date: Date;
    slotType: SlotType;
  }[];

  numberOfDays: number;

  advanceAmount?: number;

  totalAmount?: number;

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

  createdAt: Date;
  updatedAt: Date;
}