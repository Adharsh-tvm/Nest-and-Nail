import { WorkerSchedule } from "../../../../domain/entities/WorkerSchedule";
import { IWorkerScheduleRepository } from "../../../../domain/repositories/IWorkerScheduleRepository";
import { SlotType } from "../../../../shared/enums/slotEnums";
import { CreateWorkerScheduleDTO, WorkerScheduleDTO } from "../../../dtos/WorkerScheduleDTO";
import { ICreateWorkerScheduleUseCase } from "../../../interfaces/worker/profile/ICreateWorkerScheduleUseCase";
import { WorkerScheduleMapper } from "../../../mappers/WorkerScheduleMapper";

export class CreateWorkerScheduleUseCase implements ICreateWorkerScheduleUseCase {
  constructor(private workerScheduleRepository: IWorkerScheduleRepository) {}

  async execute(dto: CreateWorkerScheduleDTO): Promise<WorkerScheduleDTO[]> {
    const { workerId, startDate, endDate } = dto;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new Error("Start date cannot be after end date");
    }

    // Generate slots for each day in the date range
    const schedulesToCreate: WorkerSchedule[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      // Create a copy of the current date for the slots
      const dateForSlot = new Date(currentDate);

      // Generate the three slots for the day
      schedulesToCreate.push({
        workerId,
        date: dateForSlot,
        slotType: SlotType.SHORT,
        isBooked: false,
      });
      schedulesToCreate.push({
        workerId,
        date: dateForSlot,
        slotType: SlotType.HALF_DAY,
        isBooked: false,
      });
      schedulesToCreate.push({
        workerId,
        date: dateForSlot,
        slotType: SlotType.FULL_DAY,
        isBooked: false,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Attempt to save to the database
    try {
      const createdSchedules = await this.workerScheduleRepository.createBulk(schedulesToCreate);
      return createdSchedules.map(WorkerScheduleMapper.toDTO);
    } catch (error: any) {
      // Handle potential duplicate key errors (11000) from MongoDB
      if (error.code === 11000) {
        throw new Error("Some schedules in this date range already exist for the worker.");
      }
      throw error;
    }
  }
}
