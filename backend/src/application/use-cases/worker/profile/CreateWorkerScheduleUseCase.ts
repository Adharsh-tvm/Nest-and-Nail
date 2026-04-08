import { WorkerSchedule } from "../../../../domain/entities/WorkerSchedule";
import { IWorkerScheduleRepository } from "../../../../domain/repositories/IWorkerScheduleRepository";
import { SlotType } from "../../../../shared/enums/slotEnums";
import { CreateWorkerScheduleDTO, WorkerScheduleDTO } from "../../../dtos/WorkerScheduleDTO";
import { ICreateWorkerScheduleUseCase } from "../../../interfaces/worker/profile/ICreateWorkerScheduleUseCase";
import { WorkerScheduleMapper } from "../../../mappers/WorkerScheduleMapper";

export class CreateWorkerScheduleUseCase implements ICreateWorkerScheduleUseCase {
  constructor(private workerScheduleRepository: IWorkerScheduleRepository) { }

  async execute(dto: CreateWorkerScheduleDTO): Promise<WorkerScheduleDTO[]> {
    const { workerId, startDate, endDate } = dto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new Error("Start date cannot be after end date");
    }

    const schedulesToCreate: WorkerSchedule[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateForSlot = new Date(currentDate);

      schedulesToCreate.push({
        workerId,
        date: dateForSlot,
        slotType: SlotType.MORNING_HALF,
        isBooked: false,
        isAvailable: true,
      });
      schedulesToCreate.push({
        workerId,
        date: dateForSlot,
        slotType: SlotType.EVENING_HALF,
        isBooked: false,
        isAvailable: true,
      });
      schedulesToCreate.push({
        workerId,
        date: dateForSlot,
        slotType: SlotType.FULL_DAY,
        isBooked: false,
        isAvailable: true,
      });

      schedulesToCreate.push(
        {
          workerId,
          date: dateForSlot,
          slotType: SlotType.VIDEO_SLOT_1,
          isBooked: false,
          isAvailable: true,
        },
        {
          workerId,
          date: dateForSlot,
          slotType: SlotType.VIDEO_SLOT_2,
          isBooked: false,
          isAvailable: true,
        },
        {
          workerId,
          date: dateForSlot,
          slotType: SlotType.VIDEO_SLOT_3,
          isBooked: false,
          isAvailable: true,
        },
        {
          workerId,
          date: dateForSlot,
          slotType: SlotType.VIDEO_SLOT_4,
          isBooked: false,
          isAvailable: true,
        }
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    try {
      const createdSchedules = await this.workerScheduleRepository.createBulk(schedulesToCreate);
      return createdSchedules.map(WorkerScheduleMapper.toDTO);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Some schedules in this date range already exist for the worker.");
      }
      throw error;
    }
  }
}
