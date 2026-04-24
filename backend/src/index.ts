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
import { initSocketServer } from "./infrastructure/socket/socketServer";



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
  await connectDB(env.MONGO_URI);

  // Initialize Dependency Injection Container
  const container = new DIContainer();

  // Routes
  app.use("/", createRoutes(container));

  // Error Handler
  app.use(errorHandler);

  const server = http.createServer(app);

  initSocketServer(server, container);

  // Start server
  const PORT = env.PORT;
  server.listen(PORT, () => {
    container.infra.logger.info(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});                           