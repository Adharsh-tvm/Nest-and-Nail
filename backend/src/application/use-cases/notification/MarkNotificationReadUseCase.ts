import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class MarkNotificationReadUseCase {
  constructor(private notificationRepo: INotificationRepository) {}

  async execute(notificationId: string): Promise<void> {
    return this.notificationRepo.markAsRead(notificationId);
  }
}
