import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { createAuthRoutes } from "./auth/authRoutes";
import { createGoogleAuthRoutes } from "./auth/GoogleAuthRoutes";
import { createAdminRoutes } from "./admin/admin.routes";
import { createCategoryRoutes, createUserCategoryRoutes } from "./admin/category.routes";
import { createUserRoutes } from "./user/user.routes";
import { createUploadRoutes } from "./user/upload.routes";
import { createMediaRoutes } from "./user/media.routes";
import { createClientRoutes } from "./client/client.worker.routes";
import { createClientServiceRoutes } from "./client/client.service.routes";
import { createWorkerServiceRoutes } from "./worker/worker.service.routes";
import { createAdminServiceRoutes } from "./admin/admin.service.routes";
import { createWorkerRoutes } from "./worker/worker.routes";
import { createClientMeetingsRoutes } from "./client/client.meeting.routes";
import { createWorkerMeetingsRoutes } from "./worker/worker.meeting.routes";
import { createUsersVideoCallRoutes } from "./common/videoCall.routes";
import { createPaymentRoutes } from "./payment/payment.routes";
import { createAdminMeetingRoutes } from "./admin/admin.meeting.routes";
import { createWalletRoutes } from "./common/wallet.routes";
import { concernRoutes } from "./concern/concern.routes";
import { clientReviewRoutes } from "./review/review.routes";
import { notificationRoutes } from "./notification/notification.routes";
import { chatRoutes } from "./chat/chat.routes";
import { createTransactionRoutes } from "./payment/transaction.routes";
import { adminConcernRoutes } from "./admin/admin.concern.routes";
import { createAdminModerationRoutes } from "./admin/admin.moderation.routes";

export const createRoutes = (container: DIContainer): Router => {
  const router = Router();

  router.use("/api/auth", createAuthRoutes(container.controllers.authController, container.controllers.authMiddleware));

  router.use("/api/auth", createGoogleAuthRoutes(container.controllers.googleAuthController));

  router.use("/api/auth", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware));

  router.use("/api/admin", createAdminRoutes(container.controllers.adminController, container.controllers.authMiddleware));

  router.use("/api/admin/categories", createCategoryRoutes(container.controllers.categoryController, container.controllers.authMiddleware));

  router.use("/api/admin/services", createAdminServiceRoutes(container.controllers.adminServiceController, container.controllers.authMiddleware))

  router.use("/api/admin/meetings", createAdminMeetingRoutes(container.controllers.adminMeetingController, container.controllers.authMiddleware))

  router.use("/api/admin/concerns", container.controllers.authMiddleware.verify.bind(container.controllers.authMiddleware), adminConcernRoutes(container.controllers.adminConcernController));

  router.use("/api/admin/moderation", createAdminModerationRoutes(container.controllers.adminModerationController, container.controllers.authMiddleware));

  router.use("/api/upload", createUploadRoutes(container.controllers.uploadController, container.controllers.authMiddleware));

  router.use("/api/users/categories", createUserCategoryRoutes(container.controllers.categoryController, container.controllers.authMiddleware));

  router.use("/api/users", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware));

  router.use("/api/media", createMediaRoutes(container.controllers.mediaController));

  router.use("/api/client/workers", createClientRoutes(container.controllers.clientController, container.controllers.authMiddleware))

  router.use("/api/client/services", createClientServiceRoutes(container.controllers.clientServiceController, container.controllers.authMiddleware))

  router.use("/api/client/meetings", createClientMeetingsRoutes(container.controllers.clientMeetingsController, container.controllers.authMiddleware))

  router.use("/api/worker/meetings", createWorkerMeetingsRoutes(container.controllers.authMiddleware, container.controllers.workerMeetingsController))

  router.use("/api/worker/services", createWorkerServiceRoutes(container.controllers.workerServiceController, container.controllers.authMiddleware))

  router.use("/api/worker/", createWorkerRoutes(container.controllers.workerController, container.controllers.authMiddleware))

  router.use("/api/video-call", createUsersVideoCallRoutes(container.controllers.authMiddleware, container.controllers.videoCallController));

  router.use("/api", createPaymentRoutes(container.controllers.authMiddleware, container.controllers.paymentController));

  router.use("/api/wallet", createWalletRoutes(container.controllers.authMiddleware, container.controllers.walletController));

  router.use("/api/concerns", concernRoutes(container.controllers.authMiddleware, container.controllers.concernController));

  router.use("/api/review", clientReviewRoutes(container.controllers.authMiddleware, container.controllers.clientReviewController));

  router.use("/api/notifications", notificationRoutes(container.controllers.authMiddleware, container.controllers.notificationController));

  router.use("/api/chat", chatRoutes(container.controllers.authMiddleware, container.controllers.chatController));

  router.use("/api/transactions", createTransactionRoutes(container.controllers.authMiddleware, container.controllers.transactionController));

  return router;
};
