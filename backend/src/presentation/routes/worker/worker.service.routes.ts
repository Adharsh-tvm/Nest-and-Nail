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
        (req, res, next) => workerServiceController.getWorkerServices(req, res, next)
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res, next) => workerServiceController.getWorkerServiceDetails(req, res, next)
    );

    router.get(
        "/active",
        authMiddleware.verify.bind(authMiddleware),
        (req, res, next) => workerServiceController.getActiveService(req, res, next)
    )

    return router;
}