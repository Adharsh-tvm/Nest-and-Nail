import { VideoCallStatus } from "../../../../shared/enums/serviceEnums";

export interface VideoCallResponseDTO {
    message: string;

    videoCall: {
        roomId: string;
        startTime: Date;
        endTime: Date;

        meetingLink?: string;

        status?: VideoCallStatus;

        joinedUsers?: string[];

        startedAt?: Date | null;

        endedAt?: Date;

        duration?: string;

        accumulatedDuration?: number;
    };
}