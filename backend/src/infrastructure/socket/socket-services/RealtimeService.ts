import { IRealtimeService } from "../../../application/interfaces/socket/IRealtimeService";
import { SocketServer } from "../socketServer";

export class RealtimeService implements IRealtimeService {

  constructor(private socketServer: SocketServer) {}

  emitToUser(userId: string, event: string, data: any): void {
    const socketIds = this.socketServer.getSocketIds(userId);
    if (socketIds && socketIds.size > 0) {
      for (const socketId of socketIds) {
        this.socketServer.getIO().to(socketId).emit(event, data);
      }
    }
  }

  emitToRoom(roomId: string, event: string, data: any): void {
    this.socketServer.getIO().to(roomId).emit(event, data);
  }
}