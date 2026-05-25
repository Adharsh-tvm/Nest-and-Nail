import { WorkerSchedule } from "../../domain/entities/WorkerSchedule";
import { IWorkerScheduleRepository } from "../../domain/repositories/IWorkerScheduleRepository";
import { WorkerScheduleModel, IWorkerScheduleDocument } from "../database/models/WorkerScheduleModel";
import { FilterQuery } from "mongoose";
import { DomainError } from "../../domain/errors/DomainError";

export class WorkerScheduleRepository implements IWorkerScheduleRepository {

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
          serviceId,
          lockedUntil: null
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
        $set: {
          isBooked: false,
          serviceId: null,
          lockedUntil: null
        }
      }
    );
  }

  async findBlockedAndBookedDates(workerId: string) {
    return await WorkerScheduleModel.find({
      workerId,
      $or: [
        { isBooked: true },
        { isAvailable: false },
        { lockedUntil: { $gt: new Date() } }
      ]
    }).lean();
  }

  async lockSlot(
    workerId: string,
    date: Date,
    slotType: string,
    lockedUntil: Date,
    serviceId: string
  ): Promise<void> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    // 1. Explicitly check if any conflicting slot is already booked or locked by another serviceId
    const conflictingTypes = this.getConflictingSlotTypes(slotType);
    const initialConflicts = await WorkerScheduleModel.find({
      workerId,
      slotType: { $in: conflictingTypes },
      date: { $gte: start, $lte: end }
    }).lean();

    for (const existing of initialConflicts) {
      if (!existing.isAvailable) {
        throw new DomainError(
          `Worker is unavailable on ${date.toISOString().split('T')[0]}`,
          "WORKER_UNAVAILABLE"
        );
      }
      const isLocked = existing.lockedUntil && new Date() < new Date(existing.lockedUntil);
      if (existing.isBooked || (isLocked && existing.serviceId !== serviceId)) {
        throw new DomainError(
          `Slot already booked or temporarily reserved for date: ${date.toISOString().split('T')[0]}`,
          "SLOT_LOCKED_OR_BOOKED"
        );
      }
    }

    // 2. Perform the atomic update with upsert as a secondary safety net
    try {
      await WorkerScheduleModel.findOneAndUpdate(
        {
          workerId,
          slotType,
          date: { $gte: start, $lte: end },
          isBooked: { $ne: true },
          isAvailable: { $ne: false },
          $or: [
            { lockedUntil: { $exists: false } },
            { lockedUntil: null },
            { lockedUntil: { $lte: new Date() } },
            { serviceId: serviceId } // Allow re-locking if it's the same serviceId
          ]
        },
        {
          $set: {
            lockedUntil,
            serviceId
          },
          $setOnInsert: {
            date: start,
            isAvailable: true,
            isBooked: false
          }
        },
        { upsert: true, new: true }
      );
    } catch (error: unknown) {
      const errStr = String(error);
      if (
        (error && typeof error === "object" && "code" in error && error.code === 11000) ||
        errStr.includes("E11000") ||
        errStr.includes("duplicate key")
      ) {
        throw new DomainError(
          `Slot already booked or temporarily reserved for date: ${date.toISOString().split('T')[0]}`,
          "SLOT_LOCKED_OR_BOOKED"
        );
      }
      throw error;
    }

    // 3. Post-lock verification to prevent race conditions from concurrent updates
    const postConflicts = await WorkerScheduleModel.find({
      workerId,
      slotType: { $in: conflictingTypes },
      date: { $gte: start, $lte: end }
    }).lean();

    let hasConflict = false;
    let conflictError: DomainError | null = null;

    for (const existing of postConflicts) {
      if ((existing.slotType as unknown as string) === slotType && existing.serviceId === serviceId) {
        continue;
      }
      if (!existing.isAvailable) {
        hasConflict = true;
        conflictError = new DomainError(
          `Worker is unavailable on ${date.toISOString().split('T')[0]}`,
          "WORKER_UNAVAILABLE"
        );
        break;
      }
      const isLocked = existing.lockedUntil && new Date() < new Date(existing.lockedUntil);
      if (existing.isBooked || (isLocked && existing.serviceId !== serviceId)) {
        hasConflict = true;
        conflictError = new DomainError(
          `Slot already booked or temporarily reserved for date: ${date.toISOString().split('T')[0]}`,
          "SLOT_LOCKED_OR_BOOKED"
        );
        break;
      }
    }

    if (hasConflict) {
      // Rollback our own lock to prevent a stale/invalid lock state
      await WorkerScheduleModel.findOneAndUpdate(
        {
          workerId,
          slotType,
          date: { $gte: start, $lte: end },
          serviceId: serviceId
        },
        {
          $unset: {
            lockedUntil: 1,
            serviceId: 1
          }
        }
      );
      throw conflictError ?? new DomainError(`Slot already booked or temporarily reserved for date: ${date.toISOString().split('T')[0]}`, "SLOT_LOCKED_OR_BOOKED");
    }
  }

  async unlockSlot(workerId: string, date: Date, slotType: string, serviceId?: string): Promise<void> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const query: FilterQuery<IWorkerScheduleDocument> = {
      workerId,
      slotType,
      date: { $gte: start, $lte: end }
    };
    
    if (serviceId) {
      query.serviceId = serviceId;
    }

    await WorkerScheduleModel.findOneAndUpdate(
      query,
      {
        $unset: {
          lockedUntil: 1,
          serviceId: 1
        }
      }
    );
  }

  private getConflictingSlotTypes(slotType: string): string[] {
    if (slotType === "FULL_DAY") {
      return ["FULL_DAY", "MORNING_HALF", "EVENING_HALF"];
    }
    if (slotType === "MORNING_HALF") {
      return ["FULL_DAY", "MORNING_HALF"];
    }
    if (slotType === "EVENING_HALF") {
      return ["FULL_DAY", "EVENING_HALF"];
    }
    return [slotType];
  }
}
