import { Server, Socket } from "socket.io";
import { ChatHandler } from "./handlers/ChatHandler";
import { VideoHandler } from "./handlers/VideoCallHandler";
import { PresenceHandler } from "./handlers/PresenceHandler";

export class SocketServer {
    private io: Server;
    private userSocketMap = new Map<string, string>();

    constructor(io: Server) {
        this.io = io;
    }

    initialize() {
        this.io.on("connection", (socket: Socket) => {

            socket.on("register", (userId: string) => {
                this.userSocketMap.set(userId, socket.id);
            });

            new ChatHandler(this.io).handle(socket);
            new VideoHandler(this.io).handle(socket);
            new PresenceHandler(this.io).handle(socket);

            socket.on("disconnect", () => {
                this.removeUser(socket.id);
            });
        });
    }

    private removeUser(socketId: string) {
        for (const [userId, id] of this.userSocketMap.entries()) {
            if (id === socketId) {
                this.userSocketMap.delete(userId);
                break;
            }
        }
    }

    getSocketId(userId: string) {
        return this.userSocketMap.get(userId);
    }

    getIO() {
        return this.io;
    }
}