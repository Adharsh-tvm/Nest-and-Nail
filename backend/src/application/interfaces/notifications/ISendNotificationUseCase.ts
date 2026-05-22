import { SendNotificationDTO } from "../../dtos/common/notification/NotificationDTO";

export interface ISendNotificationUseCase {
    execute(data: SendNotificationDTO): Promise<void>;
}