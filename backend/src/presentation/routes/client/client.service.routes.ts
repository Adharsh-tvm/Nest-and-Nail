import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientServiceController } from "../../controllers/client/ClientServiceController";


const router = Router();

export function createClientServiceRoutes(
    clientServiceController: ClientServiceController,
    authMiddleware: AuthMiddleware
) {

    router.post("/book", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientServiceController.bookWorker(req, res, next); });

    router.post("/lock-slots", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientServiceController.lockSlots(req, res, next); });

    router.post("/unlock-slots", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientServiceController.unlockSlots(req, res, next); });

    router.get("/history", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientServiceController.getServiceHistory(req, res, next); });

    router.get("/ongoing", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientServiceController.getOngoingServices(req, res, next); });

    router.get("/:serviceId", authMiddleware.verify.bind(authMiddleware), (req, res, next) => { void clientServiceController.getServiceByClientId(req, res, next); });

    router.patch("/:serviceId/cancel", authMiddleware.verify.bind(authMiddleware), (req, res) => { void clientServiceController.cancelService(req, res); });

    return router;
}