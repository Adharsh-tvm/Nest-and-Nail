export interface IReserveServiceRequestUseCase {
  execute(
    requestId: string,
    workerId: string
  ): Promise<{
    reservedUntil: Date;
  }>;
}
