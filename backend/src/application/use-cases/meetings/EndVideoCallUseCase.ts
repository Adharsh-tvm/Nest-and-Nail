import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { ServiceStatus, VideoCallStatus } from "../../../shared/enums/serviceEnums";
import { IEndVideoCallUseCase } from "../../interfaces/meetings/IEndVideoCallUseCase";

export class EndVideoCallUseCase implements IEndVideoCallUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute(serviceId: string, userId: string) {
    const service = await this.serviceRepository.findById(serviceId);

    if (!service) throw new Error("Service not found");

    if (!service.videoCall) throw new Error("Meeting not found");

    if (service.clientId !== userId && service.workerId !== userId) {
      throw new Error("Unauthorized");
    }

    if (service.videoCall.status === VideoCallStatus.ENDED) {
      return {
        message: "Meeting already ended",
        videoCall: service.videoCall,
      };
    }

    const updatedVideoCall = {
      roomId: service.videoCall.roomId,
      startTime: service.videoCall.startTime,
      endTime: service.videoCall.endTime,
      meetingLink: service.videoCall.meetingLink,
      joinedUsers: service.videoCall.joinedUsers || [],
      status: VideoCallStatus.ENDED,
      startedAt: service.videoCall.startedAt,
      endedAt: new Date(),
    };

    const updated = await this.serviceRepository.updateVideoCall(
      serviceId,
      updatedVideoCall
    );

    await this.serviceRepository.updateStatus(serviceId, {
      status: ServiceStatus.COMPLETED,
    });

    return {
      message: "Meeting ended successfully",
      videoCall: updated.videoCall,
    };
  }
}