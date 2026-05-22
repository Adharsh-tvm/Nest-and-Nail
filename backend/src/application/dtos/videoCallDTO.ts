export interface UpdateVideoCallDTO {
  roomId: string;
  startTime: Date;
  endTime: Date;

  meetingLink?: string;
  status?: string;

  joinedUsers?: string[];

  actualStartTime?: Date;  // Set on first join, never cleared — used for history
  startedAt?: Date | null; // Rolling segment tracker, cleared on leave
  endedAt?: Date;
  duration?: string;
  accumulatedDuration?: number;
}