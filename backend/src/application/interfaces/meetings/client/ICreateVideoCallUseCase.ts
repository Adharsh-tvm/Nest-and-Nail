export interface ICreateVideoCallUseCase {
  execute(
    serviceId: string,
    clientId: string,
    startTime: Date,
    endTime: Date
  ): Promise<any>;
}