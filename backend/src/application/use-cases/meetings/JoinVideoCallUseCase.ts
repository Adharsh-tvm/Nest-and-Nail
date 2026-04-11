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

        if (!service.videoCall.startedAt) {
            service.videoCall.startedAt = new Date();
        }

        if (service.videoCall.joinedUsers?.includes(userId)) {
            return {
                roomId: service.videoCall.roomId,
                startTime: service.videoCall.startTime,
                endTime: service.videoCall.endTime,
            };
        }

        const now = new Date();
        const start = new Date(service.videoCall.startTime);
        const end = new Date(service.videoCall.endTime);

        const earlyJoin = new Date(start.getTime() - 5 * 60 * 1000);
        const lateJoin = new Date(end.getTime() + 10 * 60 * 1000);

        if (now < earlyJoin || now > lateJoin) {
            throw new Error("Not within allowed join time");
        }


        let joinedUsers = service.videoCall.joinedUsers || [];

        // ✅ Prevent duplicate join
        if (joinedUsers.includes(userId)) {
            return {
                roomId: service.videoCall.roomId,
                startTime: service.videoCall.startTime,
                endTime: service.videoCall.endTime,
            };
        }

        // ✅ Add user
        joinedUsers.push(userId);

        // ✅ Set status + startedAt
        let startedAt = service.videoCall.startedAt;
        let status = service.videoCall.status;

        if (!startedAt) {
            startedAt = new Date();
            status = VideoCallStatus.ONGOING;
        }

        await this.serviceRepository.updateVideoCall(serviceId, {
            roomId: service.videoCall.roomId,
            startTime: service.videoCall.startTime,
            endTime: service.videoCall.endTime,
            meetingLink: service.videoCall.meetingLink,
            joinedUsers,
            status,
            startedAt
        });

        return {
            roomId: service.videoCall.roomId,
            startTime: service.videoCall.startTime,
            endTime: service.videoCall.endTime,
        };
    }
}