import { Notification } from "../entities/Notification";

export interface INotificationRepository {
    create(notification: Notification): Promise<Notification>;
    findByUser(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<void>;
}