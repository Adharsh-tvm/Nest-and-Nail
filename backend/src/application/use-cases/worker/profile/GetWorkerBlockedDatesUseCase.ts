import { IWorkerScheduleRepository } from "../../../../domain/repositories/IWorkerScheduleRepository";
import { GetWorkerBlockedDatesResponseDTO } from "../../../dtos/WorkerScheduleDTO";
import { IGetWorkerBlockedDatesUseCase } from "../../../interfaces/worker/profile/IGetWorkerBlockedDatesUseCase";

export class GetWorkerBlockedDatesUseCase implements IGetWorkerBlockedDatesUseCase {
  constructor(private scheduleRepo: IWorkerScheduleRepository) {}

  async execute(workerId: string): Promise<GetWorkerBlockedDatesResponseDTO[]> {
    const data = await this.scheduleRepo.findBlockedAndBookedDates(workerId);

    return data.map((slot) => ({
      date: slot.date,
      slotType: slot.slotType,
      isBooked: slot.isBooked || (slot.lockedUntil ? new Date() < new Date(slot.lockedUntil) : false),
      isAvailable: slot.isAvailable,
    }));
  }
}