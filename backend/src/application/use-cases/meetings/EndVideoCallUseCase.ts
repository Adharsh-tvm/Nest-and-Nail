import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { VideoCallStatus } from "../../../shared/enums/serviceEnums";
import { IEndVideoCallUseCase } from "../../interfaces/meetings/IEndVideoCallUseCase";

export class EndVideoCallUseCase implements IEndVideoCallUseCase {
    constructor(private serviceRepository: IServiceRepository) { }

    async execute(serviceId: string, userId: string) {
        const service = await this.serviceRepository.findById(serviceId);

        if (!service) throw new Error("Service not found");

        if (!service.videoCall) throw new Error("Meeting not found");

        if (service.clientId !== userId && service.workerId !== userId) {
            throw new Error("Unauthorized");
        }

        const updated = await this.serviceRepository.updateVideoCall(serviceId, {
            roomId: service.videoCall.roomId,
            startTime: service.videoCall.startTime,
            endTime: service.videoCall.endTime,
            meetingLink: service.videoCall.meetingLink,
            joinedUsers: service.videoCall.joinedUsers,
            status: VideoCallStatus.ENDED,
            endedAt: new Date()
        });

        return {
            message: "Call ended successfully",
            videoCall: updated.videoCall,
        };
    }
}