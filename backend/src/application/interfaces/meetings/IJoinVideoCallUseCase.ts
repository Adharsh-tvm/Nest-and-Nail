export interface IJoinVideoCallUseCase {
  execute(serviceId: string, userId: string): Promise<any>;
}