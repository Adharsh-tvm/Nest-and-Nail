import { v4 as uuidv4 } from "uuid";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { IRealtimeService } from "../../interfaces/socket/IRealtimeService";

export class SendMessageUseCase {

    constructor(
        private readonly _chatRepo: IChatRepository,
        private readonly _realtimeService: IRealtimeService
    ) { }

    async execute(data: {
        chatId: string;
        senderId: string;
        receiverId: string;
        message: string;
    }) {

        const message = {
            messageId: uuidv4(),
            chatId: data.chatId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            isRead: false,
            createdAt: new Date(),
        };

        const saved = await this._chatRepo.create(message);

        // 🔥 EMIT TO RECEIVER
        this._realtimeService.emitToUser(data.receiverId, "chat-message", saved);
    }
}