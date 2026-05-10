import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientServiceController } from "../../controllers/client/ClientServiceController";


const router = Router();

export function createClientServiceRoutes(
    clientServiceController: ClientServiceController,
    authMiddleware: AuthMiddleware
) {

    router.post("/book", authMiddleware.verify.bind(authMiddleware), clientServiceController.bookWorker);

    router.get("/history", authMiddleware.verify.bind(authMiddleware), clientServiceController.getServiceHistory);

    router.get("/ongoing", authMiddleware.verify.bind(authMiddleware), clientServiceController.getOngoingServices);

    router.get("/:serviceId", authMiddleware.verify.bind(authMiddleware), clientServiceController.getServiceByClientId);

    router.patch("/:serviceId/cancel", authMiddleware.verify.bind(authMiddleware), clientServiceController.cancelService);

    return router;
}