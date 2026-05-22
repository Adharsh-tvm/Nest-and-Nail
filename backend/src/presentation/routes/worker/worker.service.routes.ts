import { Router } from "express";
import { WorkerServiceController } from "../../controllers/worker/WorkerServiceController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

export function createWorkerServiceRoutes(
    workerServiceController: WorkerServiceController,
    authMiddleware: AuthMiddleware
) {

    router.get(
        "/",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerServiceController.getWorkerServices(req, res); }
    );

    // ⚡ /active MUST be before /:serviceId — otherwise Express captures "active" as a serviceId param
    router.get(
        "/active",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerServiceController.getActiveService(req, res); }
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerServiceController.getWorkerServiceDetails(req, res); }
    );

    router.patch(
        "/:serviceId/start",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerServiceController.startService(req, res); }
    );

    router.patch(
        "/:serviceId/complete",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerServiceController.completeService(req, res); }
    );

    

    return router;
}