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
  isAvailable: boolean;
  isBooked: boolean;
  serviceId?: string;
}

export interface BlockWorkerDatesDTO {
  workerId: string;
  dates: Date[];
  slotTypes?: SlotType[];
}

export interface GetWorkerBlockedDatesResponseDTO {
  date: Date;
  slotType: SlotType;
  isBooked: boolean;
  isAvailable: boolean;
}