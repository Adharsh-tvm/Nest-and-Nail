import { WorkerSchedule } from "../entities/WorkerSchedule";

export interface IWorkerScheduleRepository {
  createBulk(schedules: WorkerSchedule[]): Promise<WorkerSchedule[]>;
  findByWorkerIdAndDateRange(workerId: string, startDate: Date, endDate: Date): Promise<WorkerSchedule[]>;
  deleteByWorkerIdAndDateRange(workerId: string, startDate: Date, endDate: Date): Promise<void>;
}
