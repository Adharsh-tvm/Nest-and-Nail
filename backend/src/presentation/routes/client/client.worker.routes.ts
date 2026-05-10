import { Router } from "express";
import { ClientController } from "../../controllers/client/ClientWorkerController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

export function createClientRoutes(
    clientController: ClientController,
    authMiddleware: AuthMiddleware
) {

    router.get("/", authMiddleware.verify.bind(authMiddleware), clientController.getAvailableWorkers);

    router.get("/:id", authMiddleware.verify.bind(authMiddleware), clientController.getWorkerById);

    router.get("/:id/availability", authMiddleware.verify.bind(authMiddleware), clientController.getWorkerAvailability);

    return router;
}