import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientServiceController } from "../../controllers/client/ClientServiceController";


const router = Router();

export function createClientServiceRoutes(
    clientServiceController: ClientServiceController,
    authMiddleware: AuthMiddleware
) {

    router.post("/services/book", authMiddleware.verify, (req, res) => clientServiceController.bookWorker(req, res))

    router.get("/services/history", authMiddleware.verify, (req, res) => clientServiceController.getServiceHistory(req, res));

    router.get("/services/ongoing", authMiddleware.verify, (req, res) => clientServiceController.getOngoingServices(req, res));

    router.get("/services/:serviceId", authMiddleware.verify, (req, res) => clientServiceController.getServiceByClientId(req, res));

    return router;
}