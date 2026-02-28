import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { createAuthRoutes } from "./auth/authRoutes";
import { createGoogleAuthRoutes } from "./auth/GoogleAuthRoutes";
import { createAdminRoutes } from "./admin/adminRoutes";
import { createUserRoutes } from "./user/user.routes";
import { createUploadRoutes } from "./user/upload.routes";
import { createMediaRoutes } from "./user/media.routes";

export const createRoutes = (container: DIContainer): Router => {
  const router = Router();

  router.use("/api/auth", createAuthRoutes(container.controllers.authController, container.controllers.authMiddleware));

  router.use("/api/auth", createGoogleAuthRoutes(container.controllers.googleAuthController));
  
  router.use("/api/auth", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware));
  
  router.use("/api/admin", createAdminRoutes(container.controllers.adminController, container.controllers.categoryController, container.controllers.authMiddleware));
  
  router.use("/api/upload", createUploadRoutes(container.controllers.uploadController, container.controllers.authMiddleware));
  
  router.use("/api/users", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware));
  
  router.use("/api/media", createMediaRoutes(container.controllers.mediaController));

  return router;
};
