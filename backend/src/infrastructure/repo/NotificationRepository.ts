import { NotificationModel } from "../database/models/NotificationModel";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";

export class NotificationRepository implements INotificationRepository {

  async create(notification: Notification): Promise<Notification> {
    const created = await NotificationModel.create(notification);
    return created.toObject();
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async markAsRead(notificationId: string): Promise<void> {
    await NotificationModel.updateOne(
      { notificationId },
      { $set: { isRead: true } }
    );
  }
}