import { WorkerSchedule } from "../entities/WorkerSchedule";

export interface IWorkerScheduleRepository {
  createBulk(schedules: WorkerSchedule[]): Promise<WorkerSchedule[]>;
  findByWorkerIdAndDateRange(workerId: string, startDate: Date, endDate: Date): Promise<WorkerSchedule[]>;
  deleteByWorkerIdAndDateRange(workerId: string, startDate: Date, endDate: Date): Promise<void>;
  findByWorkerAndDate(workerId: string, date: Date): Promise<WorkerSchedule[]>;
  findByWorkerDateAndSlot(workerId: string, date: Date, slotType: string): Promise<WorkerSchedule | null>;
  markAsBooked(workerId: string, date: Date, slotType: string, serviceId: string): Promise<void>;
  unmarkAsBooked(workerId: string, date: Date, slotType: string): Promise<void>;
  findBlockedAndBookedDates(workerId: string): Promise<WorkerSchedule[]>;
  lockSlot(workerId: string, date: Date, slotType: string, lockedUntil: Date, serviceId: string): Promise<void>;
  unlockSlot(workerId: string, date: Date, slotType: string, serviceId?: string): Promise<void>;
}
