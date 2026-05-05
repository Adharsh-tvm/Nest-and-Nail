export interface UpdateVideoCallDTO {
  roomId: string;
  startTime: Date;
  endTime: Date;

  meetingLink?: string;
  status?: string;

  joinedUsers?: string[];

  startedAt?: Date | null;
  endedAt?: Date;
  duration?: string;
  accumulatedDuration?: number;
}