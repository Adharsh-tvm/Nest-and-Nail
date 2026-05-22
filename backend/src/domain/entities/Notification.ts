export interface Notification {
    notificationId: string;
    userId: string;

    title: string;
    message: string;
    type: string;

    data?: Record<string, unknown>;

    isRead: boolean;
    createdAt: Date;
}