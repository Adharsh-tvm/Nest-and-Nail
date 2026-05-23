import { SlotType } from "../../shared/enums/slotEnums";

export interface WorkerSchedule {
  id?: string;
  workerId: string;
  date: Date;
  slotType: SlotType;
  isBooked: boolean;
  isAvailable: boolean; 
  serviceId?: string;
  lockedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
