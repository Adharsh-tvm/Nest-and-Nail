export interface IGetWorkerAvailabilityUseCase {
  execute(
    workerId: string,
    date: Date
  ): Promise<{
    halfDayAvailable: boolean;
    fullDayAvailable: boolean;
  }>;
}