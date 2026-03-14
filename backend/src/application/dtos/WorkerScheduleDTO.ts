import { SlotType } from "../../shared/enums/slotEnums";

export interface CreateWorkerScheduleDTO {
  workerId: string;
  startDate: Date;
  endDate: Date;
}

export interface WorkerScheduleDTO {
  id?: string;
  workerId: string;
  date: Date;
  slotType: SlotType;
  isBooked: boolean;
  serviceId?: string;
}
