import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientServiceController } from "../../controllers/client/ClientServiceController";


const router = Router();

export function createClientServiceRoutes(
    clientServiceController: ClientServiceController,
    authMiddleware: AuthMiddleware
) {

    router.post("/book", authMiddleware.verify.bind(authMiddleware), (req, res) => { void clientServiceController.bookWorker(req, res); })

    router.get("/history", authMiddleware.verify.bind(authMiddleware), (req, res) => { void clientServiceController.getServiceHistory(req, res); });

    router.get("/ongoing", authMiddleware.verify.bind(authMiddleware), (req, res) => { void clientServiceController.getOngoingServices(req, res); });

    router.get("/:serviceId", authMiddleware.verify.bind(authMiddleware), (req, res) => { void clientServiceController.getServiceByClientId(req, res); });

    router.patch("/:serviceId/cancel", authMiddleware.verify.bind(authMiddleware), (req, res) => { void clientServiceController.cancelService(req, res); });

    return router;
}