export interface IGetWorkerAvailabilityUseCase {
  execute(
    workerId: string,
    date: Date
  ): Promise<{
    morningAvailable: boolean;
    eveningAvailable: boolean;
    fullDayAvailable: boolean;
    isBooked: boolean;
    isUnavailable: boolean;
    bookedSlots?: string[];
  }>;
  executeBulk?(
    workerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, { morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; isBooked: boolean; isUnavailable: boolean; bookedSlots?: string[]; }>>;
}