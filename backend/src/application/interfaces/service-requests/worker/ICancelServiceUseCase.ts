export interface ICancelServiceUseCase {
    execute(serviceId: string, reason: string): Promise<void>;
}