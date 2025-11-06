import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./infrastructure/database/connection";
import { ClientRepository } from "./infrastructure/repo/ClientRepository";
import { BcryptPasswordHasher } from "./infrastructure/utils/BcryptPasswordHasher";
import { UUIDGenerator } from "./infrastructure/utils/UUIDGenerator";
import { ClientModel } from "./infrastructure/database/models/ClientModel";
import { RegisterClientUseCase } from "./application/use-cases/RegisterClientUseCase";
import { LoginClientUseCase } from "./application/use-cases/LoginClientUseCase";
import { AuthController } from "./presentation/controllers/AuthController";
import { createClientRoutes } from "./presentation/routes/authRoutes";
import { errorHandler } from "./presentation/middlewares/ErrorHandler";
import { JwtTokenService } from "./infrastructure/utils/JwtTokenService";
import { IRegisterClientUseCase } from "./application/interfaces/IRegisterClientUseCase";
import { GetCurrentUserUseCase } from "./application/use-cases/GetCurrentUserUseCase";
import { AuthMiddleware } from "./presentation/middlewares/AuthMiddleware";
import cookieParser from "cookie-parser";
import { ILoginClientUseCase } from "./application/interfaces/ILoginClientUseCase";
import { IGetCurrentUserUseCase } from "./application/interfaces/IGetCurrentUserUseCase";
import { loggerInstance } from "./infrastructure/logger/Logger";
import { RequestLogger } from "./presentation/middlewares/RequestLogger";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./shared/lib/auth";
import { GoogleAuthUseCase } from "./application/use-cases/GoogleAuthUseCase";
import { IGoogleAuthUseCase } from "./application/interfaces/IGoogleAuthUseCase";

dotenv.config();

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true, // Allow cookies
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(RequestLogger)

  app.all("/api/auth/*", toNodeHandler(auth));


  // Connect to MongoDB
  await connectDB(process.env.MONGO_URI ?? "mongodb://localhost:27017/MEND-WAY");

  // Infrastructure
  const repo = new ClientRepository(ClientModel);
  const passwordHasher = new BcryptPasswordHasher();
  const idGenerator = new UUIDGenerator();

  //jwt
  const tokenService = new JwtTokenService(
    process.env.ACCESS_TOKEN_SECRET ?? "default-access-secret",
    process.env.REFRESH_TOKEN_SECRET ?? "default-refresh-secret",
  );


  // Application
  const registerUseCase: IRegisterClientUseCase = new RegisterClientUseCase(repo, passwordHasher, idGenerator, tokenService);
  const loginUseCase: ILoginClientUseCase = new LoginClientUseCase(repo, passwordHasher, tokenService, loggerInstance);
  const getCurrentUserUseCase: IGetCurrentUserUseCase = new GetCurrentUserUseCase(repo);
  const googleAuthUseCase: IGoogleAuthUseCase = new GoogleAuthUseCase(repo, idGenerator, tokenService)

  // Presentation
  const authController = new AuthController(registerUseCase, loginUseCase, getCurrentUserUseCase, googleAuthUseCase);
  const authMiddleware = new AuthMiddleware(tokenService)

  // Routes
  app.use("/api/client", createClientRoutes(authController, authMiddleware));

  //Error Handler
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    loggerInstance.info(`Server running on http://localhost:${PORT}`)
  });
}

bootstrap();
