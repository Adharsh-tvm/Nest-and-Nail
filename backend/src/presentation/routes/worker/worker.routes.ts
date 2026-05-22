import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { WorkerController } from "../../controllers/worker/WorkerController";

const router = Router();

export function createWorkerRoutes(
    workerController: WorkerController,
    authMiddleware: AuthMiddleware
) {

    router.post(
        "/slot/block-dates",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerController.blockDates(req, res); }
    );

    router.get(
        "/slot/blocked-dates",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerController.getBlockedDates(req, res); }
    );

    router.get(
        "/dashboard",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerController.getDashboardData(req, res); }
    );

    return router;
}