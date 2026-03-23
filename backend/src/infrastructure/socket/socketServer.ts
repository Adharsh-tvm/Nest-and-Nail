import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export class SocketServer {
  private static io: Server;

  static init(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      socket.on("join", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  static getIO(): Server {
    if (!this.io) {
      throw new Error("Socket.io not initialized");
    }
    return this.io;
  }
}