import { WorkerSchedule } from "../../domain/entities/WorkerSchedule";
import { IWorkerScheduleRepository } from "../../domain/repositories/IWorkerScheduleRepository";
import { WorkerScheduleModel } from "../database/models/WorkerScheduleModel";

export class WorkerScheduleRepository implements IWorkerScheduleRepository {
  constructor() {
  }

  async createBulk(schedules: WorkerSchedule[]): Promise<WorkerSchedule[]> {
    const created = await WorkerScheduleModel.insertMany(schedules, { ordered: false });
    return created.map((doc) => doc.toObject() as WorkerSchedule);
  }

  async findByWorkerIdAndDateRange(workerId: string, startDate: Date, endDate: Date): Promise<WorkerSchedule[]> {
    const schedules = await WorkerScheduleModel.find({
      workerId,
      date: { $gte: startDate, $lte: endDate },
    }).lean();
    return schedules as WorkerSchedule[];
  }

  async deleteByWorkerIdAndDateRange(workerId: string, startDate: Date, endDate: Date): Promise<void> {
    await WorkerScheduleModel.deleteMany({
      workerId,
      date: { $gte: startDate, $lte: endDate },
    });
  }
}
