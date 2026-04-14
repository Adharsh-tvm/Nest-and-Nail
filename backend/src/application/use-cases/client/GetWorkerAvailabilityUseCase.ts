import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { SlotType } from "../../../shared/enums/slotEnums";
import { IGetWorkerAvailabilityUseCase } from "../../interfaces/client/IGetWorkerAvailabilityUseCase";

export class GetWorkerAvailabilityUseCase implements IGetWorkerAvailabilityUseCase {

    constructor(
        private readonly _workerScheduleRepo: IWorkerScheduleRepository
    ) { }

    async execute(workerId: string, date: Date): Promise<{ morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; isBooked: boolean; isUnavailable: boolean; bookedSlots?: string[]; }> {

        const schedules = await this._workerScheduleRepo.findByWorkerAndDate(workerId, date);

        const morningUnavailable = schedules.some(
            s => s.slotType === SlotType.MORNING_HALF && (!s.isAvailable || s.isBooked)
        );

        const eveningUnavailable = schedules.some(
            s => s.slotType === SlotType.EVENING_HALF && (!s.isAvailable || s.isBooked)
        );

        const fullDayUnavailable = schedules.some(
            s => s.slotType === SlotType.FULL_DAY && (!s.isAvailable || s.isBooked)
        );

        const eveningBooked = schedules.some(
            s => s.slotType === SlotType.EVENING_HALF && s.isBooked
        );

        const fullDayBooked = schedules.some(
            s => s.slotType === SlotType.FULL_DAY && s.isBooked
        );

        const bookedSlots = schedules.filter(s => s.isBooked).map(s => s.slotType);

        return {
            morningAvailable: !morningUnavailable && !fullDayUnavailable,
            eveningAvailable: !eveningUnavailable && !fullDayUnavailable,
            fullDayAvailable: !morningUnavailable && !eveningUnavailable && !fullDayUnavailable,
            isBooked: fullDayBooked || eveningBooked || schedules.some(s => s.slotType === SlotType.MORNING_HALF && s.isBooked),
            isUnavailable: schedules.some(s => !s.isAvailable),
            bookedSlots
        };
    }

    async executeBulk(workerId: string, startDate: Date, endDate: Date): Promise<Record<string, { morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; isBooked: boolean; isUnavailable: boolean; bookedSlots?: string[]; }>> {
        const schedules = await this._workerScheduleRepo.findByWorkerIdAndDateRange(workerId, startDate, endDate);

        const result: Record<string, { morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; isBooked: boolean; isUnavailable: boolean; bookedSlots?: string[]; }> = {};

        // Initialize all dates in range implicitly via ISO iteration
        const cur = new Date(startDate);
        cur.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        while (cur <= end) {
            const dateKey = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
            result[dateKey] = { morningAvailable: true, eveningAvailable: true, fullDayAvailable: true, isBooked: false, isUnavailable: false, bookedSlots: [] };
            cur.setDate(cur.getDate() + 1);
        }

        // Process booked schedules
        for (const s of schedules) {
            if (s.isAvailable && !s.isBooked) continue;
            const dt = new Date(s.date);
            const dateStr = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
            if (result[dateStr]) {
                if (s.isBooked) {
                     result[dateStr].isBooked = true;
                     result[dateStr].bookedSlots = result[dateStr].bookedSlots || [];
                     result[dateStr].bookedSlots.push(s.slotType);
                }
                if (!s.isAvailable) result[dateStr].isUnavailable = true;

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