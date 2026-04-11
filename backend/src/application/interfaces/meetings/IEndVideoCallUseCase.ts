export interface IEndVideoCallUseCase {
  execute(serviceId: string, userId: string): Promise<any>;
}