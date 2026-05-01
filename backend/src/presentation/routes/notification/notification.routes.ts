import express from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { NotificationController } from "../../controllers/notification/NotificationController";

export const notificationRoutes = (
  authMiddleware: AuthMiddleware,
  controller: NotificationController
) => {
  const router = express.Router();

  router.get(
    "/",
    authMiddleware.verify.bind(authMiddleware),
    controller.getMyNotifications
  );

  router.patch(
    "/:notificationId/read",
    authMiddleware.verify.bind(authMiddleware),
    controller.markAsRead
  );

  return router;
};
