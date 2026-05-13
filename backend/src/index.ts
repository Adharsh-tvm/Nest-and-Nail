import express from "express";
import { env } from "./config/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./infrastructure/database/connection";
import { errorHandler } from "./presentation/middlewares/ErrorHandler";
import { RequestLogger } from "./presentation/middlewares/RequestLogger";
import { DIContainer } from "./infrastructure/di/DIContainer";
import { createRoutes } from "./presentation/routes";
import http from "http";
import { Server } from "socket.io";
import { SocketServer } from "./infrastructure/socket/socketServer";
import { RealtimeService } from "./infrastructure/socket/socket-services/RealtimeService";



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

  // Connect to MongoDB
  await connectDB(env.MONGO_URI);

  // Initialize Dependency Injection Container
  const container = new DIContainer();
  const server = http.createServer(app);
  
  // Use logger middleware after container initialization
  app.use(RequestLogger(container.infra.logger));

  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  
  // Error Handler
  app.use(errorHandler);
  
  
  const socketServer = new SocketServer(io);
  socketServer.initialize();
  
  const realtimeService = new RealtimeService(socketServer);
  
  container.infra.setRealtimeService(realtimeService);
  
  // Routes
  app.use("/", createRoutes(container));

  // Start automatic moderation checking background job (runs every 15 minutes)
  const MODERATION_CHECK_INTERVAL_MS = 15 * 60 * 1000;
  setInterval(() => {
    void (async () => {
      try {
        container.infra.logger.info("Running automatic moderation detection checks...");
        const result = await container.useCases.processModerationActionsUseCase.execute();
        container.infra.logger.info(`Automatic moderation check completed. Case 1: ${String(result.case1ProcessedCount)} physical no-shows, Case 2: ${String(result.case2ProcessedCount)} worker meeting absences, Case 3: ${String(result.case3ProcessedCount)} client meeting absences.`);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        container.infra.logger.error(`Error running automatic moderation background check: ${errMsg}`);
      }
    })();
  }, MODERATION_CHECK_INTERVAL_MS);
  
  // Start server
  const PORT = env.PORT;
  server.listen(PORT, () => {
    container.infra.logger.info(`Server running on http://localhost:${String(PORT)}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});                           