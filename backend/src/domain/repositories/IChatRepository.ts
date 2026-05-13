import { ChatMessage } from "../entities/ChatMessage";

export interface IChatRepository {
    create(message: ChatMessage): Promise<ChatMessage>;
    findByChatId(chatId: string): Promise<ChatMessage[]>;
    markAsRead(chatId: string, userId: string): Promise<void>;
}