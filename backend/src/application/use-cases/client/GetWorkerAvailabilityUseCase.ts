import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { SlotType } from "../../../shared/enums/slotEnums";
import { IGetWorkerAvailabilityUseCase } from "../../interfaces/client/IGetWorkerAvailabilityUseCase";

export class GetWorkerAvailabilityUseCase implements IGetWorkerAvailabilityUseCase {

    constructor(
        private readonly workerScheduleRepo: IWorkerScheduleRepository
    ) { }

    async execute(workerId: string, date: Date): Promise<{ halfDayAvailable: boolean; fullDayAvailable: boolean; }> {

        const schedules = await this.workerScheduleRepo.findByWorkerAndDate(workerId, date);

        const halfDayBooked = schedules.some(
            s => s.slotType === SlotType.HALF_DAY && s.isBooked
        );

        const fullDayBooked = schedules.some(
            s => s.slotType === SlotType.FULL_DAY && s.isBooked
        );

        return {
            halfDayAvailable: !halfDayBooked,
            fullDayAvailable: !fullDayBooked
        }
    }
}