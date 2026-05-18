import { v4 as uuidv4 } from "uuid";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { IRealtimeService } from "../../interfaces/socket/IRealtimeService";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class SendMessageUseCase {

    constructor(
        private readonly _chatRepo: IChatRepository,
        private readonly _realtimeService: IRealtimeService,
        private readonly _s3Service: S3Service
    ) { }

    async execute(data: {
        chatId: string;
        senderId: string;
        receiverId: string;
        message: string;
        attachmentUrl?: string;
        messageType?: string;
    }) {

        const message = {
            messageId: uuidv4(),
            chatId: data.chatId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            attachmentUrl: data.attachmentUrl,
            messageType: data.messageType || "text",
            isRead: false,
            createdAt: new Date(),
        };

        const saved = await this._chatRepo.create(message);

        // Generate a presigned url for the realtime event so the receiver can access it
        const emitMessage = { ...saved };
        if (saved.attachmentUrl) {
            try {
                emitMessage.attachmentUrl = await this._s3Service.getPresignedDownloadUrl(saved.attachmentUrl);
            } catch (err) {
                console.error("Failed to generate presigned download URL for socket message", err);
            }
        }

        // 🔥 EMIT TO RECEIVER
        this._realtimeService.emitToUser(data.receiverId, "chat-message", emitMessage);
    }
}