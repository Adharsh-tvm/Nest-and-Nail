export interface ChatMessage {
    messageId: string;
    chatId: string;

    senderId: string;
    receiverId: string;

    message: string;
    attachmentUrl?: string;
    messageType?: string; // "text" | "image" | etc.

    isRead: boolean;
    createdAt: Date;
}