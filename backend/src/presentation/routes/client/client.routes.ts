import { Router } from "express";
import { ClientController } from "../../controllers/ClientController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";


const router = Router();

export function createClientRoutes(
    clientController: ClientController,
    authMiddleware: AuthMiddleware
) {

    router.get("/workers", (req, res, next) => { authMiddleware.verify(req, res, next); }, (req, res) => clientController.getAvailableWorkers(req, res))

    router.get("/workers/:id", (req, res, next) => { authMiddleware.verify(req, res, next); }, (req, res) => clientController.getWorkerById(req, res))

    router.get("/workers/:id/availability", (req, res, next) => { authMiddleware.verify(req, res, next); }, (req, res) => clientController.getWorkerAvailability(req, res));

    router.post("/services/book", authMiddleware.verify, (req, res)=> clientController.bookWorker(req, res))

    return router;
}