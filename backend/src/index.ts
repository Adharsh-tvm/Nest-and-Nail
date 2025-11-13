import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./infrastructure/database/connection";
import { BcryptPasswordHasher } from "./infrastructure/utils/BcryptPasswordHasher";
import { UUIDGenerator } from "./infrastructure/utils/UUIDGenerator";
import { AuthController } from "./presentation/controllers/AuthController";
import { createAuthRoutes } from "./presentation/routes/authRoutes";
import { errorHandler } from "./presentation/middlewares/ErrorHandler";
import { JwtTokenService } from "./infrastructure/utils/JwtTokenService";
import { AuthMiddleware } from "./presentation/middlewares/AuthMiddleware";
import cookieParser from "cookie-parser";
import { loggerInstance } from "./infrastructure/logger/Logger";
import { RequestLogger } from "./presentation/middlewares/RequestLogger";
import { UserRepositoryFactory } from "./infrastructure/repo/UserRepositoryFactory";
import { RegisterUserUseCase } from "./application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "./application/use-cases/LoginUserUseCase";
import { GetCurrentUserUseCase } from "./application/use-cases/GetCurrentUserUseCase";

dotenv.config();

async function bootstrap() {
  const app = express();
  
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(RequestLogger);

  // Connect to MongoDB
  await connectDB(process.env.MONGO_URI ?? "mongodb://localhost:27017/MEND-WAY");

  // Infrastructure Layer
  const repositoryFactory = new UserRepositoryFactory();
  const passwordHasher = new BcryptPasswordHasher();
  const idGenerator = new UUIDGenerator();
  const tokenService = new JwtTokenService(
    process.env.ACCESS_TOKEN_SECRET ?? "default-access-secret",
    process.env.REFRESH_TOKEN_SECRET ?? "default-refresh-secret",
  );

  // Application Layer - Use Cases (with proper dependency injection)
  const registerUserUseCase = new RegisterUserUseCase(
    repositoryFactory,
    passwordHasher,
    idGenerator,
    tokenService,
    loggerInstance
  );

  const loginUserUseCase = new LoginUserUseCase(
    repositoryFactory,
    passwordHasher,
    tokenService,
    loggerInstance
  );

  const getCurrentUserUseCase = new GetCurrentUserUseCase(
    repositoryFactory,
    loggerInstance
  );

  // Presentation Layer - Controller (depends on use cases, NOT repositories)
  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    getCurrentUserUseCase
  );

  const authMiddleware = new AuthMiddleware(tokenService);

  // Routes
  app.use("/api/auth", createAuthRoutes(authController, authMiddleware));

  // Error Handler
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT ?? 4000;
  app.listen(PORT, () => {
    loggerInstance.info(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
