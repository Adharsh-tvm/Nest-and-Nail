import { ChatMessage } from "../../../domain/entities/ChatMessage";

export interface IGetMessagesUseCase {
    execute(chatId: string): Promise<ChatMessage[]>;
}