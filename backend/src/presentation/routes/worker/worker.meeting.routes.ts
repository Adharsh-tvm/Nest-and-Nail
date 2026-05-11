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
        (req, res) => { void workerMeetingsController.getScheduledMeetings(req, res); }
    );

    router.get(
        "/history",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerMeetingsController.getMeetingsHistory(req, res); }
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void workerMeetingsController.getMeetingById(req, res); }
    );

    return router;
}