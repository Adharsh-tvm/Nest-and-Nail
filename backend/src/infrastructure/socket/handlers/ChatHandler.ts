import { Server, Socket } from "socket.io";

export class ChatHandler {
  constructor(private io: Server) {}

  handle(socket: Socket) {
    socket.on("join-chat", (chatId: string) => {
      void socket.join(chatId);
    });

    socket.on("send-message", ({ chatId, message }: { chatId: string; message: unknown }) => {
      this.io.to(chatId).emit("receive-message", message);
    });
  }
}