import { v4 as uuidv4 } from "uuid";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { IRealtimeService } from "../../interfaces/socket/IRealtimeService";

export class SendNotificationUseCase {

  constructor(
    private realtimeService: IRealtimeService,
    private notificationRepo: INotificationRepository
  ) {}

  async execute(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    data?: any;
  }) {

    const notification = {
      notificationId: uuidv4(),
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      data: data.data,
      isRead: false,
      createdAt: new Date(),
    };

    const saved = await this.notificationRepo.create(notification);

    // 🔥 REAL-TIME PUSH
    this.realtimeService.emitToUser(data.userId, "notification", saved);
  }
}