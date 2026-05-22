import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { Notification } from "../../../domain/entities/Notification";

export class GetUserNotificationsUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<Notification[]> {
    return this.notificationRepo.findByUser(userId);
  }
}
