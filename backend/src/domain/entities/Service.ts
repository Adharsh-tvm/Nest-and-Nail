import { PaymentStatus } from "../../shared/enums/paymentStatus";
import { ServiceStatus } from "../../shared/enums/serviceEnums";

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