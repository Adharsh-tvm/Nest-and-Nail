import { Server, Socket } from "socket.io";
import { ChatHandler } from "./handlers/ChatHandler";
import { VideoHandler } from "./handlers/VideoCallHandler";
import { PresenceHandler } from "./handlers/PresenceHandler";

export class SocketServer {
    private io: Server;
    // One user can have MULTIPLE open sockets (tabs, components)
    private userSocketMap = new Map<string, Set<string>>();

    constructor(io: Server) {
        this.io = io;
    }

    initialize() {
        this.io.on("connection", (socket: Socket) => {

            socket.on("register", (userId: string) => {
                let sockets = this.userSocketMap.get(userId);
                if (!sockets) {
                    sockets = new Set();
                    this.userSocketMap.set(userId, sockets);
                }
                sockets.add(socket.id);
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
        for (const [userId, socketIds] of this.userSocketMap.entries()) {
            if (socketIds.has(socketId)) {
                socketIds.delete(socketId);
                if (socketIds.size === 0) {
                    this.userSocketMap.delete(userId);
                }
                break;
            }
        }
    }

    /** Returns all socket IDs registered for a user (may be multiple tabs/components) */
    getSocketIds(userId: string): Set<string> | undefined {
        return this.userSocketMap.get(userId);
    }

    /** @deprecated Use getSocketIds */
    getSocketId(userId: string): string | undefined {
        const set = this.userSocketMap.get(userId);
        return set ? [...set][0] : undefined;
    }

    getIO() {
        return this.io;
    }
}