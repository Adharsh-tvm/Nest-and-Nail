export interface ILeaveVideoCallUseCase {
  execute(serviceId: string, userId: string): Promise<any>;
}
