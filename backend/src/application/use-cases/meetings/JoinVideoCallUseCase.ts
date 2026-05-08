import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { VideoCallStatus } from "../../../shared/enums/serviceEnums";
import { IJoinVideoCallUseCase } from "../../interfaces/meetings/IJoinVideoCallUseCase";
import { ISendNotificationUseCase } from "../../interfaces/notifications/ISendNotificationUseCase";


export class JoinVideoCallUseCase implements IJoinVideoCallUseCase {
    constructor(
        private readonly _serviceRepository: IServiceRepository,
        private readonly _sendNotificationUseCase: ISendNotificationUseCase
    ) { }

    async execute(serviceId: string, userId: string) {
        const service = await this._serviceRepository.findById(serviceId);

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

        await this._serviceRepository.updateVideoCall(serviceId, {
            ...service.videoCall,
            joinedUsers,
            status,
            startedAt,
        });

        // Notify the OTHER participant that this user has joined (ring bell)
        const isClient = service.clientId === userId;
        const otherUserId = isClient ? service.workerId : service.clientId;
        const joinerLabel = isClient ? "Client" : "Worker";

        if (otherUserId) {
            await this._sendNotificationUseCase.execute({
                userId: otherUserId,
                title: "🔔 Meeting Room — Someone Joined!",
                message: `${joinerLabel} has entered the video call room. Join now to connect!`,
                type: "MEETING_JOINED",
                data: { serviceId, roomId: service.videoCall.roomId },
            });
        }

        return {
            roomId: service.videoCall.roomId,
            startTime: service.videoCall.startTime,
            endTime: service.videoCall.endTime,
        };
    }
}