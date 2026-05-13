import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { LeaveVideoCallResponseDTO } from "../../dtos/common/videocall/LeaveVideoCallResponseDTO";
import { ILeaveVideoCallUseCase } from "../../interfaces/meetings/ILeaveVideoCallUseCase";

export class LeaveVideoCallUseCase implements ILeaveVideoCallUseCase {
  constructor(private serviceRepository: IServiceRepository) { }

  async execute(
    serviceId: string,
    userId: string
  ): Promise<LeaveVideoCallResponseDTO> {
    const service = await this.serviceRepository.findById(serviceId);

    if (!service) throw new Error("Service not found");
    if (!service.videoCall) throw new Error("Meeting not found");

    if (service.clientId !== userId && service.workerId !== userId) {
      throw new Error("Unauthorized");
    }

    const now = new Date();
    let accumulatedDuration = service.videoCall.accumulatedDuration ?? 0;

    if (service.videoCall.startedAt) {
      const segmentMs = now.getTime() - new Date(service.videoCall.startedAt).getTime();
      accumulatedDuration += Math.floor(segmentMs / 1000);
    }

    await this.serviceRepository.updateVideoCall(serviceId, {
      ...service.videoCall,
      startedAt: null, // Clear startedAt as the segment ended
      accumulatedDuration,
    });

    return {
      message: "Left video call successfully",
      accumulatedDuration,
    };
  }
}
