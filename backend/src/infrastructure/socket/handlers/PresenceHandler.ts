import { Server, Socket } from "socket.io";

export class PresenceHandler {
    constructor(private io: Server) { }

    handle(socket: Socket) {
        socket.on("online", (userId: string) => {
            this.io.emit("user-status", { userId, status: "ONLINE" });
        });

        socket.on("disconnect", () => {
            this.io.emit("user-status", { socketId: socket.id, status: "OFFLINE" });
        });
    }
}