export interface IRealtimeService {
    emitToUser(userId: string, event: string, data: any): void;
    emitToRoom(roomId: string, event: string, data: any): void;
}