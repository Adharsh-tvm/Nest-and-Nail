import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { SlotType } from "../../../shared/enums/slotEnums";
import { IGetWorkerAvailabilityUseCase } from "../../interfaces/client/IGetWorkerAvailabilityUseCase";

export class GetWorkerAvailabilityUseCase implements IGetWorkerAvailabilityUseCase {

    constructor(
        private readonly workerScheduleRepo: IWorkerScheduleRepository
    ) { }

    async execute(workerId: string, date: Date): Promise<{ morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; }> {

        const schedules = await this.workerScheduleRepo.findByWorkerAndDate(workerId, date);

        const morningBooked = schedules.some(
            s => s.slotType === SlotType.MORNING_HALF && s.isBooked
        );

        const eveningBooked = schedules.some(
            s => s.slotType === SlotType.EVENING_HALF && s.isBooked
        );

        const fullDayBooked = schedules.some(
            s => s.slotType === SlotType.FULL_DAY && s.isBooked
        );

        return {
            morningAvailable: !morningBooked && !fullDayBooked,
            eveningAvailable: !eveningBooked && !fullDayBooked,
            fullDayAvailable: !morningBooked && !eveningBooked && !fullDayBooked
        }
    }

    async executeBulk(workerId: string, startDate: Date, endDate: Date): Promise<Record<string, { morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; }>> {
        const schedules = await this.workerScheduleRepo.findByWorkerIdAndDateRange(workerId, startDate, endDate);
        
        const result: Record<string, { morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; }> = {};

        // Initialize all dates in range implicitly via ISO iteration
        const cur = new Date(startDate);
        cur.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        
        while(cur <= end) {
            const dateKey = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
            result[dateKey] = { morningAvailable: true, eveningAvailable: true, fullDayAvailable: true };
            cur.setDate(cur.getDate() + 1);
        }
        
        // Process booked schedules
        for (const s of schedules) {
            if (!s.isBooked) continue;
            const dt = new Date(s.date);
            const dateStr = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
            if (result[dateStr]) {
                if (s.slotType === SlotType.MORNING_HALF) {
                    result[dateStr].morningAvailable = false;
                    result[dateStr].fullDayAvailable = false;
                } else if (s.slotType === SlotType.EVENING_HALF) {
                    result[dateStr].eveningAvailable = false;
                    result[dateStr].fullDayAvailable = false;
                } else if (s.slotType === SlotType.FULL_DAY) {
                    result[dateStr].morningAvailable = false;
                    result[dateStr].eveningAvailable = false;
                    result[dateStr].fullDayAvailable = false;
                }
            }
        }

        return result;
    }
}