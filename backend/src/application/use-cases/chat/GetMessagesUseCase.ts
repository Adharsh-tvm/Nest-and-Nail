import { ChatMessage } from "../../../domain/entities/ChatMessage";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { IGetMessagesUseCase } from "../../interfaces/chat/IGetMessagesUseCase";

export class GetMessagesUseCase implements IGetMessagesUseCase {

    constructor(private readonly _chatRepo: IChatRepository) { }

    async execute(chatId: string): Promise<ChatMessage[]> {
        return this._chatRepo.findByChatId(chatId);
    }
}