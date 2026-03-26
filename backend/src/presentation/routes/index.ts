import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { createAuthRoutes } from "./auth/authRoutes";
import { createGoogleAuthRoutes } from "./auth/GoogleAuthRoutes";
import { createAdminRoutes } from "./admin/adminRoutes";
import { createCategoryRoutes, createUserCategoryRoutes } from "./admin/categoryRoutes";
import { createUserRoutes } from "./user/user.routes";
import { createUploadRoutes } from "./user/upload.routes";
import { createMediaRoutes } from "./user/media.routes";
import { createClientRoutes } from "./client/client.worker.routes";
import { createClientServiceRoutes } from "./client/client.service.routes";
import { createWorkerServiceRoutes } from "./worker/worker.service.routes";

export const createRoutes = (container: DIContainer): Router => {
  const router = Router();

  router.use("/api/auth", createAuthRoutes(container.controllers.authController, container.controllers.authMiddleware));

  router.use("/api/auth", createGoogleAuthRoutes(container.controllers.googleAuthController));

  router.use("/api/auth", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware));

  router.use("/api/admin", createAdminRoutes(container.controllers.adminController, container.controllers.authMiddleware));

  router.use("/api/admin/categories", createCategoryRoutes(container.controllers.categoryController, container.controllers.authMiddleware));

  router.use("/api/upload", createUploadRoutes(container.controllers.uploadController, container.controllers.authMiddleware));

  router.use("/api/users/categories", createUserCategoryRoutes(container.controllers.categoryController, container.controllers.authMiddleware));

  router.use("/api/users", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware));

  router.use("/api/media", createMediaRoutes(container.controllers.mediaController));

  router.use("/api/client/workers", createClientRoutes(container.controllers.clientController, container.controllers.authMiddleware))

  router.use("/api/client/services", createClientServiceRoutes(container.controllers.clientServiceController, container.controllers.authMiddleware))

  router.use("/api/worker/services", createWorkerServiceRoutes(container.controllers.workerServiceController, container.controllers.authMiddleware))

  return router;
};
