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
        workerController.blockDates
    );

    router.get(
        "/slot/blocked-dates",
        authMiddleware.verify.bind(authMiddleware),
        workerController.getBlockedDates
    );

    return router;
}