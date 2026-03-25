import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientServiceController } from "../../controllers/client/ClientServiceController";


const router = Router();

export function createClientServiceRoutes(
    clientServiceController: ClientServiceController,
    authMiddleware: AuthMiddleware
) {

    router.post("/book", authMiddleware.verify, (req, res) => clientServiceController.bookWorker(req, res))

    router.get("/history", authMiddleware.verify, (req, res) => clientServiceController.getServiceHistory(req, res));

    router.get("/ongoing", authMiddleware.verify, (req, res) => clientServiceController.getOngoingServices(req, res));

    router.get("/:serviceId", authMiddleware.verify, (req, res) => clientServiceController.getServiceByClientId(req, res));

    return router;
}