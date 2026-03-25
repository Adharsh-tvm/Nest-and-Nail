import { Router } from "express";
import { ClientController } from "../../controllers/client/ClientWorkerController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

export function createClientRoutes(
    clientController: ClientController,
    authMiddleware: AuthMiddleware
) {

    router.get("/", (req, res, next) => { authMiddleware.verify(req, res, next); }, (req, res) => clientController.getAvailableWorkers(req, res))

    router.get("/:id", (req, res, next) => { authMiddleware.verify(req, res, next); }, (req, res) => clientController.getWorkerById(req, res))

    router.get("/:id/availability", (req, res, next) => { authMiddleware.verify(req, res, next); }, (req, res) => clientController.getWorkerAvailability(req, res));

    return router;
}