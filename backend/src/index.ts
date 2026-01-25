import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./infrastructure/database/connection";
import { createAuthRoutes } from "./presentation/routes/auth/authRoutes";
import { errorHandler } from "./presentation/middlewares/ErrorHandler";
import { RequestLogger } from "./presentation/middlewares/RequestLogger";
import { DIContainer } from "./infrastructure/di/DIContainer";
import { createGoogleAuthRoutes } from "./presentation/routes/auth/GoogleAuthRoutes";
import { createAdminRoutes } from "./presentation/routes/admin/adminRoutes";
import { createUserRoutes } from "./presentation/routes/user/userRoutes";
import { createUploadRoutes } from "./presentation/routes/user/uploadRoutes";

dotenv.config();

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://nominatim.openstreetmap.org/"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(RequestLogger);

  // Connect to MongoDB
  await connectDB(process.env.MONGO_URI ?? "mongodb://localhost:27017/MEND-WAY");

  // Initialize Dependency Injection Container
  const container = new DIContainer();

  // Routes
  app.use("/api/auth", createAuthRoutes(container.controllers.authController, container.controllers.authMiddleware));

  app.use("/api/auth", createGoogleAuthRoutes(container.controllers.googleAuthController));

  app.use("/api/auth", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware));

  app.use("/api/admin", createAdminRoutes(container.controllers.adminController));

  app.use("/api/upload", createUploadRoutes(container.controllers.uploadController, container.controllers.authMiddleware));

  app.use("/api/users", createUserRoutes(container.controllers.userController, container.controllers.userProfileController, container.controllers.authMiddleware))


  // Error Handler
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT ?? 4000;
  app.listen(PORT, () => {
    container.infra.logger.info(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});                           