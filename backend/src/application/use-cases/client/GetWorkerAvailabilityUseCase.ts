import { IWorkerScheduleRepository } from "../../../domain/repositories/IWorkerScheduleRepository";
import { SlotType } from "../../../shared/enums/slotEnums";
import { IGetWorkerAvailabilityUseCase } from "../../interfaces/client/IGetWorkerAvailabilityUseCase";
import { WorkerSchedule } from "../../../domain/entities/WorkerSchedule";

export class GetWorkerAvailabilityUseCase implements IGetWorkerAvailabilityUseCase {

    constructor(
        private readonly _workerScheduleRepo: IWorkerScheduleRepository
    ) { }

    async execute(workerId: string, date: Date): Promise<{ morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; isBooked: boolean; isUnavailable: boolean; bookedSlots?: string[]; }> {

        const schedules = await this._workerScheduleRepo.findByWorkerAndDate(workerId, date);

        const isLocked = (s: WorkerSchedule) => s.lockedUntil && new Date() < new Date(s.lockedUntil);

        const morningUnavailable = schedules.some(
            s => s.slotType === SlotType.MORNING_HALF && (!s.isAvailable || s.isBooked || isLocked(s))
        );

        const eveningUnavailable = schedules.some(
            s => s.slotType === SlotType.EVENING_HALF && (!s.isAvailable || s.isBooked || isLocked(s))
        );

        const fullDayUnavailable = schedules.some(
            s => s.slotType === SlotType.FULL_DAY && (!s.isAvailable || s.isBooked || isLocked(s))
        );

        const eveningBooked = schedules.some(
            s => s.slotType === SlotType.EVENING_HALF && (s.isBooked || isLocked(s))
        );

        const fullDayBooked = schedules.some(
            s => s.slotType === SlotType.FULL_DAY && (s.isBooked || isLocked(s))
        );

        const bookedSlots = schedules.filter(s => s.isBooked || isLocked(s)).map(s => s.slotType);

        return {
            morningAvailable: !morningUnavailable && !fullDayUnavailable,
            eveningAvailable: !eveningUnavailable && !fullDayUnavailable,
            fullDayAvailable: !morningUnavailable && !eveningUnavailable && !fullDayUnavailable,
            isBooked: fullDayBooked || eveningBooked || schedules.some(s => s.slotType === SlotType.MORNING_HALF && (s.isBooked || isLocked(s))),
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
            const dateKey = `${String(cur.getFullYear())}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
            result[dateKey] = { morningAvailable: true, eveningAvailable: true, fullDayAvailable: true, isBooked: false, isUnavailable: false, bookedSlots: [] };
            cur.setDate(cur.getDate() + 1);
        }

        // Process booked schedules
        for (const s of schedules) {
            const isLock = s.lockedUntil && new Date() < new Date(s.lockedUntil);
            if (s.isAvailable && !s.isBooked && !isLock) continue;
            const dt = new Date(s.date);
            const dateStr = `${String(dt.getUTCFullYear())}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
            const entry = result[dateStr] as typeof result[string] | undefined;
            if (entry) {
                if (s.isBooked || isLock) {
                     entry.isBooked = true;
                     entry.bookedSlots = entry.bookedSlots ?? [];
                     entry.bookedSlots.push(s.slotType);
                }
                if (!s.isAvailable) entry.isUnavailable = true;

                if (s.slotType === SlotType.MORNING_HALF) {
                    entry.morningAvailable = false;
                    entry.fullDayAvailable = false;
                } else if (s.slotType === SlotType.EVENING_HALF) {
                    entry.eveningAvailable = false;
                    entry.fullDayAvailable = false;
                } else if (s.slotType === SlotType.FULL_DAY) {
                    entry.morningAvailable = false;
                    entry.eveningAvailable = false;
                    entry.fullDayAvailable = false;
                }
            }
        }

        return result;
    }
}