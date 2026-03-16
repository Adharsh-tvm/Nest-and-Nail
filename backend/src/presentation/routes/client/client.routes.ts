import { Router } from "express";
import { ClientController } from "../../controllers/ClientController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";


const router = Router();

export function createClientRoutes(
    clientController: ClientController,
    authMiddleware: AuthMiddleware
) {

    router.get("/workers", (req, res) => clientController.getAvailableWorkers(req, res))

    return router;
}