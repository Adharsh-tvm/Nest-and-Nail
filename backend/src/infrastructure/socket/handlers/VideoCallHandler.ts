import { Server, Socket } from "socket.io";

// Track users per room: roomId -> Set of socketIds
const roomParticipants = new Map<string, Set<string>>();
// Track which socket belongs to which room (for cleanup)
const socketRooms = new Map<string, string>();

export class VideoHandler {
    constructor(private io: Server) { }

    handle(socket: Socket) {
        socket.on("join-room", ({ roomId, userId, role }: { roomId: string; userId: string; role: string }) => {
            const participants = roomParticipants.get(roomId) ?? new Set<string>();

            // Detect duplicate join: reject if room already has 2 participants
            for (const existingSocketId of participants) {
                const existingSocket = this.io.sockets.sockets.get(existingSocketId);
                if (existingSocket && existingSocketId !== socket.id) {
                    if (participants.size >= 2) {
                        socket.emit("duplicate-tab");
                        return;
                    }
                }
            }

            participants.add(socket.id);
            roomParticipants.set(roomId, participants);
            socketRooms.set(socket.id, roomId);

            socket.join(roomId);

            if (participants.size === 1) {
                // First participant: wait for the other
                socket.emit("waiting");
            } else if (participants.size === 2) {
                // Second participant joined: tell the FIRST one to initiate the offer
                // Emit start-call to the first participant (not the one who just joined)
                const firstSocketId = [...participants].find(id => id !== socket.id);
                if (firstSocketId) {
                    this.io.to(firstSocketId).emit("start-call");
                    //  Ring bell: tell the first participant who joined
                    this.io.to(firstSocketId).emit("user-joined-ring", { role });
                }
                // Tell second participant to wait for the offer
                socket.emit("waiting-for-offer");
            } else {
                // Room is full (3+ people)
                socket.emit("duplicate-tab");
                participants.delete(socket.id);
                socket.leave(roomId);
            }
        });

        socket.on("offer", (data: { roomId: string; offer: object }) => {
            socket.to(data.roomId).emit("offer", data.offer);
        });

        socket.on("answer", (data: { roomId: string; answer: object }) => {
            socket.to(data.roomId).emit("answer", data.answer);
        });

        socket.on("ice-candidate", (data: { roomId: string; candidate: object }) => {
            socket.to(data.roomId).emit("ice-candidate", data.candidate);
        });

        socket.on("leave-room", ({ roomId }: { roomId: string }) => {
            this.cleanupSocket(socket, roomId);
        });

        socket.on("disconnect", () => {
            const roomId = socketRooms.get(socket.id);
            if (roomId) {
                this.cleanupSocket(socket, roomId);
            }
        });
    }

    private cleanupSocket(socket: Socket, roomId: string) {
        const participants = roomParticipants.get(roomId);
        if (participants) {
            participants.delete(socket.id);
            if (participants.size === 0) {
                roomParticipants.delete(roomId);
            } else {
                // Notify the remaining participant
                this.io.to(roomId).emit("user-left");
            }
        }
        socketRooms.delete(socket.id);
        socket.leave(roomId);
    }
}