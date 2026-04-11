import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { WorkerMeetingsController } from "../../controllers/worker/WorkerMeetingController";

const router = Router();

export function createWorkerMeetingsRoutes(

    authMiddleware: AuthMiddleware,
    workerMeetingsController: WorkerMeetingsController
) {

    router.get(
        "/scheduled",
        authMiddleware.verify.bind(authMiddleware),
        workerMeetingsController.getScheduledMeetings
    );

    router.get(
        "/history",
        authMiddleware.verify.bind(authMiddleware),
        workerMeetingsController.getMeetingsHistory
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        workerMeetingsController.getMeetingById
    );

    return router;
}