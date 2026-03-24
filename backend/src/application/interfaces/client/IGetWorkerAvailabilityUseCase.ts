export interface IGetWorkerAvailabilityUseCase {
  execute(
    workerId: string,
    date: Date
  ): Promise<{
    morningAvailable: boolean;
    eveningAvailable: boolean;
    fullDayAvailable: boolean;
  }>;
  executeBulk?(
    workerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, { morningAvailable: boolean; eveningAvailable: boolean; fullDayAvailable: boolean; }>>;
}