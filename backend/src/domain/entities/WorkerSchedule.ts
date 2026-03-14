import { SlotType } from "../../shared/enums/slotEnums";

export interface WorkerSchedule {
  id?: string;
  workerId: string;
  date: Date;
  slotType: SlotType;
  isBooked: boolean;
  serviceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
