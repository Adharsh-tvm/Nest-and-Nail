export interface IRealtimeService {
    emitToUser(userId: string, event: string, data: unknown): void;
    emitToRoom(roomId: string, event: string, data: unknown): void;
}