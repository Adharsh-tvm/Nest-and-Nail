import { Router } from "express";
import { ClientController } from "../../controllers/client/ClientWorkerController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

export function createClientRoutes(
    clientController: ClientController,
    authMiddleware: AuthMiddleware
) {

    router.get("/", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientController.getAvailableWorkers(req, res, next); });

    router.get("/:id", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientController.getWorkerById(req, res, next); });

    router.get("/:id/availability", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientController.getWorkerAvailability(req, res, next); });

    return router;
}