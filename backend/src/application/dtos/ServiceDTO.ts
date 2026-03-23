import { PaymentStatus } from "../../shared/enums/paymentStatus";
import { ServiceStatus } from "../../shared/enums/serviceEnums";
import { SlotType } from "../../shared/enums/slotEnums";

export interface CreateServiceDTO {
  clientId: string;
  workerId: string;
  category: string;

  scheduledDate: Date;
  slotType: SlotType;

  numberOfDays?: number;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  title?: string;
  description?: string;
}

export interface ServiceResponseDTO {
  serviceId: string;

  clientId: string;
  workerId: string;

  category: string;

  scheduledDate: Date;
  slotType: SlotType;

  status: ServiceStatus;
  paymentStatus: PaymentStatus;

  createdAt: Date;
}