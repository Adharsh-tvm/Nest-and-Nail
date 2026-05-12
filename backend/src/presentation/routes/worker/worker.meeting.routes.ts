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
        (req, res, next) => { void workerMeetingsController.getScheduledMeetings(req, res, next); }
    );

    router.get(
        "/history",
        authMiddleware.verify.bind(authMiddleware),
        (req, res, next) => { void workerMeetingsController.getMeetingsHistory(req, res, next); }
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res, next) => { void workerMeetingsController.getMeetingById(req, res, next); }
    );

    return router;
}