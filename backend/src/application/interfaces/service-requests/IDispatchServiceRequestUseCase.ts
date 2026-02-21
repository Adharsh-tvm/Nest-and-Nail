export interface IDispatchServiceRequestUseCase {
  execute(requestId: string): Promise<void>;
}