import { Server } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    // Map<roomId, Map<socketId, userId>>
    const roomUsers = new Map<string, Map<string, string>>();

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", ({ roomId, userId }) => {
            socket.join(roomId);

            if (!roomUsers.has(roomId)) {
                roomUsers.set(roomId, new Map());
            }

            const users = roomUsers.get(roomId)!;
            users.set(socket.id, userId);

            console.log(`[join-room] roomId=${roomId}, userId=${userId}, total=${users.size}`);

            if (users.size === 1) {
                // First user — wait for someone to join
                socket.emit("waiting", { message: "Waiting for the other participant..." });
            } else {
                // Second (or more) user joined — notify existing users to start the call
                // Tell all OTHER users in the room to create an offer
                socket.to(roomId).emit("start-call");
                // Tell this user to wait for the offer
                socket.emit("waiting-for-offer");
                // Notify everyone about the new join
                socket.to(roomId).emit("user-joined", { userId, socketId: socket.id });
            }
        });

        socket.on("offer", ({ roomId, offer }) => {
            console.log(`[offer] roomId=${roomId}`);
            socket.to(roomId).emit("offer", offer);
        });

        socket.on("answer", ({ roomId, answer }) => {
            console.log(`[answer] roomId=${roomId}`);
            socket.to(roomId).emit("answer", answer);
        });

        socket.on("ice-candidate", ({ roomId, candidate }) => {
            socket.to(roomId).emit("ice-candidate", candidate);
        });

        socket.on("leave-room", ({ roomId, userId }) => {
            socket.leave(roomId);

            const users = roomUsers.get(roomId);
            if (users) {
                users.delete(socket.id);
                if (users.size === 0) {
                    roomUsers.delete(roomId);
                }
            }

            socket.to(roomId).emit("user-left", userId);
            console.log(`[leave-room] roomId=${roomId}, userId=${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            // Clean up from all rooms this socket was in
            roomUsers.forEach((users, roomId) => {
                if (users.has(socket.id)) {
                    const userId = users.get(socket.id);
                    users.delete(socket.id);
                    socket.to(roomId).emit("user-left", userId);
                    if (users.size === 0) {
                        roomUsers.delete(roomId);
                    }
                }
            });
        });
    });

    return io;
};