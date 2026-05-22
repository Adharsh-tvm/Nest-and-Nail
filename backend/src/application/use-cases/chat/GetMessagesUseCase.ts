import { ChatMessage } from "../../../domain/entities/ChatMessage";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { IGetMessagesUseCase } from "../../interfaces/chat/IGetMessagesUseCase";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetMessagesUseCase implements IGetMessagesUseCase {

    constructor(
        private readonly _chatRepo: IChatRepository,
        private readonly _s3Service: S3Service
    ) { }

    async execute(chatId: string): Promise<ChatMessage[]> {
        const messages = await this._chatRepo.findByChatId(chatId);
        
        return Promise.all(
            messages.map(async (msg) => {
                if (msg.attachmentUrl && !msg.attachmentUrl.startsWith("http")) {
                    try {
                        const presignedUrl = await this._s3Service.getPresignedDownloadUrl(msg.attachmentUrl);
                        return { ...msg, attachmentUrl: presignedUrl };
                    } catch (error) {
                        console.error("Failed to generate presigned URL for message", msg.messageId, error);
                    }
                }
                return msg;
            })
        );
    }
}