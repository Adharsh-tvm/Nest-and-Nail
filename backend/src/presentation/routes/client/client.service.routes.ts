import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientServiceController } from "../../controllers/client/ClientServiceController";


const router = Router();

export function createClientServiceRoutes(
    clientServiceController: ClientServiceController,
    authMiddleware: AuthMiddleware
) {

    router.post("/book", authMiddleware.verify.bind(authMiddleware), (req, res, next) => clientServiceController.bookWorker(req, res, next))

    router.get("/history", authMiddleware.verify.bind(authMiddleware), (req, res, next) => clientServiceController.getServiceHistory(req, res, next));

    router.get("/ongoing", authMiddleware.verify.bind(authMiddleware), (req, res, next) => clientServiceController.getOngoingServices(req, res, next));

    router.get("/:serviceId", authMiddleware.verify.bind(authMiddleware), (req, res, next) => clientServiceController.getServiceByClientId(req, res, next));

    return router;
}