import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IJoinVideoCallUseCase } from "../../../interfaces/meetings/worker/IJoinVideoCallUseCase";

export class JoinVideoCallUseCase implements IJoinVideoCallUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository
  ) {}

  async execute(serviceId: string, userId: string): Promise<any> {
    const service = await this.serviceRepository.findById(serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    if (
      service.clientId !== userId &&
      service.workerId !== userId
    ) {
      throw new Error("Unauthorized");
    }

    if (!service.videoCall?.roomId) {
      throw new Error("Meeting not scheduled");
    }

    const now = new Date();

    if (now < new Date(service.videoCall.startTime)) {
      throw new Error("Meeting not started yet");
    }

    return {
      roomId: service.videoCall.roomId,
      meetingLink: service.videoCall.joinUrl,
      startTime: service.videoCall.startTime,
      endTime: service.videoCall.endTime
    };
  }
}