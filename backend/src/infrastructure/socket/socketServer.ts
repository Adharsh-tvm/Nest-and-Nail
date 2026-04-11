import { Server } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    const roomUsers = new Map<string, Set<string>>();

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", ({ roomId, userId }) => {
            socket.join(roomId);

            if (!roomUsers.has(roomId)) {
                roomUsers.set(roomId, new Set());
            }

            const users = roomUsers.get(roomId)!;
            users.add(userId);

            const isInitiator = users.size === 1;

            socket.emit("initiate-call", { isInitiator });

            socket.to(roomId).emit("user-joined", userId);
        });

        socket.on("offer", ({ roomId, offer }) => {
            socket.to(roomId).emit("offer", offer);
        });

        socket.on("answer", ({ roomId, answer }) => {
            socket.to(roomId).emit("answer", answer);
        });

        socket.on("ice-candidate", ({ roomId, candidate }) => {
            socket.to(roomId).emit("ice-candidate", candidate);
        });

        socket.on("leave-room", ({ roomId, userId }) => {
            socket.leave(roomId);

            const users = roomUsers.get(roomId);
            users?.delete(userId);

            socket.to(roomId).emit("user-left", userId);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

    return io;
};