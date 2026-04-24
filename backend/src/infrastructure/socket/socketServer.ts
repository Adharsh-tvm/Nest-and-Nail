import { Server } from "socket.io";
import http from "http";
import { DIContainer } from "../di/DIContainer";

export const initSocketServer = (server: http.Server, container: DIContainer) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    const serviceRepository = container.infra.serviceRepository;
    const logger = container.infra.logger;

    // Map<roomId, Map<socketId, userId>>
    const roomUsers = new Map<string, Map<string, string>>();
    // Map<roomId, NodeJS.Timeout>
    const roomIntervals = new Map<string, NodeJS.Timeout>();

    const updateDuration = async (roomId: string) => {
        try {
            const service = await serviceRepository.findById(roomId);
            if (!service || !service.videoCall || !service.videoCall.startedAt || service.videoCall.endedAt) {
                return;
            }

            const now = new Date();
            const accumulatedBase = service.videoCall.accumulatedDuration ?? 0;
            const segmentMs = now.getTime() - new Date(service.videoCall.startedAt).getTime();
            const totalSeconds = accumulatedBase + Math.floor(segmentMs / 1000);

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;


            let duration = "0s";
            if (hours > 0) {
                duration = `${hours}h ${minutes}m ${seconds}s`;
            } else if (minutes > 0) {
                duration = `${minutes}m ${seconds}s`;
            } else {
                duration = `${seconds}s`;
            }

            await serviceRepository.updateVideoCall(roomId, {
                roomId: service.videoCall.roomId,
                startTime: service.videoCall.startTime,
                endTime: service.videoCall.endTime,
                meetingLink: service.videoCall.meetingLink,
                joinedUsers: service.videoCall.joinedUsers || [],
                status: service.videoCall.status,
                startedAt: service.videoCall.startedAt,
                duration,
            });

            console.log(`[heartbeat] roomId=${roomId}, duration=${duration}`);
        } catch (err) {
            logger.error(`Error in heartbeat updateDuration for room ${roomId}:`, err);
        }
    };

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", async ({ roomId, userId, role }) => {
            socket.join(roomId);

            if (!roomUsers.has(roomId)) {
                roomUsers.set(roomId, new Map());
            }

            const users = roomUsers.get(roomId)!;

            // Prevent duplicate roles
            if (role) {
                let isDuplicate = false;
                for (const existingUserId of users.values()) {
                    if (existingUserId.startsWith(`${role}-`)) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (isDuplicate) {
                    console.log(`[join-room] Rejected duplicate role=${role} for roomId=${roomId}`);
                    socket.emit("duplicate-tab");
                    socket.leave(roomId);
                    return;
                }
            }

            users.set(socket.id, userId);
            console.log(`[join-room] roomId=${roomId}, userId=${userId}, total=${users.size}`);

            if (users.size === 1) {
                // First user in the room — (re)start the segment timer in DB
                try {
                    const service = await serviceRepository.findById(roomId);
                    if (service && service.videoCall && !service.videoCall.endedAt && !service.videoCall.startedAt) {
                        await serviceRepository.updateVideoCall(roomId, {
                            roomId: service.videoCall.roomId,
                            startTime: service.videoCall.startTime,
                            endTime: service.videoCall.endTime,
                            meetingLink: service.videoCall.meetingLink,
                            joinedUsers: service.videoCall.joinedUsers || [],
                            status: service.videoCall.status,
                            startedAt: new Date(),              // Start this segment's clock
                            accumulatedDuration: service.videoCall.accumulatedDuration ?? 0,
                        });
                    }
                } catch (err) {
                    logger.error(`Error setting startedAt on join for room ${roomId}:`, err);
                }

                socket.emit("waiting", { message: "Waiting for the other participant..." });

                // Start heartbeat if not already running
                if (!roomIntervals.has(roomId)) {
                    const interval = setInterval(() => updateDuration(roomId), 10000);
                    roomIntervals.set(roomId, interval);
                    console.log(`[socket] Started heartbeat for roomId=${roomId}`);
                }
            } else {
                socket.to(roomId).emit("start-call");
                socket.emit("waiting-for-offer");
                socket.to(roomId).emit("user-joined", { userId, socketId: socket.id });
            }
        });

        socket.on("leave-room", async ({ roomId, userId }) => {
            socket.leave(roomId);

            const users = roomUsers.get(roomId);
            if (users) {
                users.delete(socket.id);
                if (users.size === 0) {
                    handleEmptyRoom(roomId);
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
                        handleEmptyRoom(roomId);
                    }
                }
            });
        });

        const handleEmptyRoom = async (roomId: string) => {
            roomUsers.delete(roomId);

            // Stop heartbeat
            const interval = roomIntervals.get(roomId);
            if (interval) {
                clearInterval(interval);
                roomIntervals.delete(roomId);
                console.log(`[socket] Stopped heartbeat for roomId=${roomId} (Room empty)`);
            }

            try {
                const service = await serviceRepository.findById(roomId);
                if (service && service.videoCall && !service.videoCall.endedAt) {
                    // Calculate how many seconds elapsed in THIS session segment
                    let newAccumulated = service.videoCall.accumulatedDuration ?? 0;

                    if (service.videoCall.startedAt) {
                        const now = new Date();
                        const segmentMs = now.getTime() - new Date(service.videoCall.startedAt).getTime();
                        newAccumulated += Math.floor(segmentMs / 1000);
                        console.log(`[socket] Room empty — saving ${newAccumulated}s accumulated for roomId=${roomId}`);
                    }

                    await serviceRepository.updateVideoCall(roomId, {
                        roomId: service.videoCall.roomId,
                        startTime: service.videoCall.startTime,
                        endTime: service.videoCall.endTime,
                        meetingLink: service.videoCall.meetingLink,
                        joinedUsers: service.videoCall.joinedUsers || [],
                        status: service.videoCall.status,
                        startedAt: undefined,            // Reset current segment start
                        accumulatedDuration: newAccumulated, // Persist total so far
                    });
                }
            } catch (err) {
                logger.error(`Error saving accumulated duration for room ${roomId}:`, err);
            }
        };

        socket.on("offer", ({ roomId, offer }) => {
            socket.to(roomId).emit("offer", offer);
        });

        socket.on("answer", ({ roomId, answer }) => {
            socket.to(roomId).emit("answer", answer);
        });

        socket.on("ice-candidate", ({ roomId, candidate }) => {
            socket.to(roomId).emit("ice-candidate", candidate);
        });
    });

    return io;
};
