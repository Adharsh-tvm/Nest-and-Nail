export interface ISendMessageUseCase {
    execute(data: {
        chatId: string;
        senderId: string;
        receiverId: string;
        message: string;
    }): Promise<void>;
}