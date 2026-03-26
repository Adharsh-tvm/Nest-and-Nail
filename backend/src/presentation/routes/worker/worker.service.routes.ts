import { Router } from "express";
import { WorkerServiceController } from "../../controllers/worker/WorkerServiceController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

export function createWorkerServiceRoutes(
    workerServiceController: WorkerServiceController,
    authMiddleware: AuthMiddleware
) {

    router.get(
        "/services",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => workerServiceController.getWorkerServices(req, res)
    );

    router.get(
        "/services/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => workerServiceController.getWorkerServiceDetails(req, res)
    );

    router.get(
        "/services/active",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => workerServiceController.getActiveService(req, res)
    )

    return router;
}