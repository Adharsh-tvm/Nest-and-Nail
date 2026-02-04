export interface IReleaseServiceRequestUseCase {
  execute(
    requestId: string
  ): Promise<void>;
}
