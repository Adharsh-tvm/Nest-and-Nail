import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { VideoCallStatus } from "../../../shared/enums/serviceEnums";
import { IJoinVideoCallUseCase } from "../../interfaces/meetings/IJoinVideoCallUseCase";


export class JoinVideoCallUseCase implements IJoinVideoCallUseCase {
    constructor(private serviceRepository: IServiceRepository) { }

    async execute(serviceId: string, userId: string) {
        const service = await this.serviceRepository.findById(serviceId);

        if (!service) throw new Error("Service not found");
        if (!service.videoCall) throw new Error("Meeting not available");

        if (service.clientId !== userId && service.workerId !== userId) {
            throw new Error("Unauthorized");
        }

        const now = new Date();
        const start = new Date(service.videoCall.startTime);
        const end = new Date(service.videoCall.endTime);

        // Relaxed time restriction for better UX/testing
        /*
        const earlyJoin = new Date(start.getTime() - 15 * 60 * 1000); // 15 mins early
        const lateJoin = new Date(end.getTime() + 60 * 60 * 1000); // 1 hour late

        if (now < earlyJoin || now > lateJoin) {
            throw new Error("Not within allowed join time");
        }
        */

        let joinedUsers = service.videoCall.joinedUsers || [];
        if (!joinedUsers.includes(userId)) {
            joinedUsers.push(userId);
        }

        let startedAt = service.videoCall.startedAt;
        let status = service.videoCall.status;

        // If no one is currently in the "session" (startedAt is null), start a new segment
        if (!startedAt) {
            startedAt = new Date();
            status = VideoCallStatus.ONGOING;
        }

        await this.serviceRepository.updateVideoCall(serviceId, {
            ...service.videoCall,
            joinedUsers,
            status,
            startedAt,
        });

        return {
            roomId: service.videoCall.roomId,
            startTime: service.videoCall.startTime,
            endTime: service.videoCall.endTime,
        };
    }
}