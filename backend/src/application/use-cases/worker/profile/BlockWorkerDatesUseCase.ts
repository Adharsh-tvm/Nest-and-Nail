import { WorkerSchedule } from "../../../../domain/entities/WorkerSchedule";
import { IWorkerScheduleRepository } from "../../../../domain/repositories/IWorkerScheduleRepository";
import { SlotType } from "../../../../shared/enums/slotEnums";
import { BlockWorkerDatesDTO } from "../../../dtos/WorkerScheduleDTO";
import { IBlockWorkerDatesUseCase } from "../../../interfaces/worker/profile/IBlockWorkerDatesUseCase";

export class BlockWorkerDatesUseCase implements IBlockWorkerDatesUseCase {
  constructor(private repo: IWorkerScheduleRepository) { }

  async execute(dto: BlockWorkerDatesDTO) {

    const schedules: WorkerSchedule[] = [];

    for (const date of dto.dates) {

      const slots: SlotType[] = dto.slotTypes ?? [SlotType.FULL_DAY];

      for (const slot of slots) {
        schedules.push({
          workerId: dto.workerId,
          date,
          slotType: slot,
          isBooked: false,
          isAvailable: false
        });
      }
    }

    return this.repo.createBulk(schedules);
  }
}