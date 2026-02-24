export interface ICompleteServiceUseCase {
    execute(serviceId: string, workerId: string): Promise<void>;
}