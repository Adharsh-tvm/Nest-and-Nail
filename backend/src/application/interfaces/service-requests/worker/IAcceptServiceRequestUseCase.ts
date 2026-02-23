export interface IAcceptServiceRequestUseCase {
  execute(requestId: string, workerId: string): Promise<void>;
}