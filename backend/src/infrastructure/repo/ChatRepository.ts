import { ChatMessageModel } from "../database/models/ChatMessageModel";
import { IChatRepository } from "../../domain/repositories/IChatRepository";
import { ChatMessage } from "../../domain/entities/ChatMessage";

export class ChatRepository implements IChatRepository {

    async create(message: ChatMessage): Promise<ChatMessage> {
        const created = await ChatMessageModel.create(message);
        return created.toObject();
    }

    async findByChatId(chatId: string): Promise<ChatMessage[]> {
        return ChatMessageModel.find({ chatId })
            .sort({ createdAt: 1 })
            .lean();
    }

    async markAsRead(chatId: string, userId: string): Promise<void> {
        await ChatMessageModel.updateMany(
            { chatId, receiverId: userId, isRead: false },
            { $set: { isRead: true } }
        );
    }
}