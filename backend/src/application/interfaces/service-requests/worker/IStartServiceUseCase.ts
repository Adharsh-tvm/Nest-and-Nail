export interface IStartServiceUseCase {
  execute(serviceId: string, workerId: string): Promise<void>;
}