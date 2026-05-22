export interface ISendMessageUseCase {
    execute(data: {
        chatId: string;
        senderId: string;
        receiverId: string;
        message: string;
        attachmentUrl?: string;
        messageType?: string;
    }): Promise<void>;
}