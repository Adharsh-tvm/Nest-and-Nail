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

  async findByWorkerAndDate(workerId: string, date: Date): Promise<WorkerSchedule[]> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const schedules = await WorkerScheduleModel.find({
      workerId,
      date: { $gte: start, $lte: end }
    }).lean();

    return schedules as WorkerSchedule[];
  }

  async deleteByWorkerIdAndDateRange(workerId: string, startDate: Date, endDate: Date): Promise<void> {
    await WorkerScheduleModel.deleteMany({
      workerId,
      date: { $gte: startDate, $lte: endDate },
    });
  }

  async findByWorkerDateAndSlot(workerId: string, date: Date, slotType: string): Promise<WorkerSchedule | null> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    return await WorkerScheduleModel.findOne({
      workerId,
      slotType,
      date: { $gte: start, $lte: end }
    }).lean();
  }

  async markAsBooked(
    workerId: string,
    date: Date,
    slotType: string,
    serviceId: string
  ): Promise<void> {

    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    await WorkerScheduleModel.findOneAndUpdate(
      {
        workerId,
        slotType,
        date: { $gte: start, $lte: end }
      },
      {
        $set: {
          isBooked: true,
          serviceId
        },
        $setOnInsert: {
          date: start,
          isAvailable: true
        }
      },
      { upsert: true }
    );
  }

  async unmarkAsBooked(workerId: string, date: Date, slotType: string): Promise<void> {

    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    await WorkerScheduleModel.findOneAndUpdate(
      {
        workerId,
        slotType,
        date: { $gte: start, $lte: end }
      },
      {
        isBooked: false,
        serviceId: null
      }
    );
  }

  async findBlockedAndBookedDates(workerId: string) {
    return await WorkerScheduleModel.find({
      workerId,
      $or: [
        { isBooked: true },
        { isAvailable: false }
      ]
    }).lean();
  }
}
