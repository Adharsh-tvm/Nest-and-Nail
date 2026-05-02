import { IChatRepository } from "../../../domain/repositories/IChatRepository";

export class GetMessagesUseCase {

    constructor(private readonly _chatRepo: IChatRepository) { }

    async execute(chatId: string) {
        return this._chatRepo.findByChatId(chatId);
    }
}