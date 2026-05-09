import { Request, Response } from "express";
import { GetUserNotificationsUseCase } from "../../../application/use-cases/notification/GetUserNotificationsUseCase";
import { MarkNotificationReadUseCase } from "../../../application/use-cases/notification/MarkNotificationReadUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";

export class NotificationController {
  constructor(
    private readonly _getNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly _markReadUseCase: MarkNotificationReadUseCase
  ) {}

  getMyNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json(
          ResponseHandler.error("Unauthorized")
        );
      }
      const notifications = await this._getNotificationsUseCase.execute(userId);
      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(notifications, "Notifications fetched")
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error(message)
      );
    }
  };

  markAsRead = async (req: Request, res: Response) => {
    try {
      const { notificationId } = req.params;
      await this._markReadUseCase.execute(notificationId);
      return res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, "Notification marked as read")
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error(message)
      );
    }
  };
}
