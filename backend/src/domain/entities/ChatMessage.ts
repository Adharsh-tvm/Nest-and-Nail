export interface ChatMessage {
    messageId: string;
    chatId: string;

    senderId: string;
    receiverId: string;

    message: string;

    isRead: boolean;
    createdAt: Date;
}