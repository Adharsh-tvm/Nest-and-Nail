import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { ServiceStatus, VideoCallStatus } from "../../../shared/enums/serviceEnums";
import { IEndVideoCallUseCase } from "../../interfaces/meetings/IEndVideoCallUseCase";

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

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

    const endedAt = new Date();

    let totalSeconds = service.videoCall.accumulatedDuration ?? 0;

    if (service.videoCall.startedAt) {
      const segmentMs = endedAt.getTime() - new Date(service.videoCall.startedAt).getTime();
      totalSeconds += Math.floor(segmentMs / 1000);
    }

    const duration = totalSeconds > 0 ? formatDuration(totalSeconds) : "0s";

    const updatedVideoCall = {
      roomId: service.videoCall.roomId,
      startTime: service.videoCall.startTime,
      endTime: service.videoCall.endTime,
      meetingLink: service.videoCall.meetingLink,
      joinedUsers: service.videoCall.joinedUsers || [],
      status: VideoCallStatus.ENDED,
      startedAt: service.videoCall.startedAt,
      endedAt,
      duration,
      accumulatedDuration: totalSeconds,
    };

    const updated = await this.serviceRepository.updateVideoCall(serviceId, updatedVideoCall);

    await this.serviceRepository.updateStatus(serviceId, {
      status: ServiceStatus.COMPLETED,
    });

    return {
      message: "Meeting ended successfully",
      videoCall: updated.videoCall,
    };
  }
}