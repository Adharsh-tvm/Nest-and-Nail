import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientMeetingsController } from "../../controllers/client/ClientMeetingController";


const router = Router();

export function createClientMeetingsRoutes(
    clientMeetingsController: ClientMeetingsController,
    authMiddleware: AuthMiddleware
) {

    router.get(
        "/scheduled",
        authMiddleware.verify.bind(authMiddleware),
        (req, res, next) => { void clientMeetingsController.getScheduledMeetings(req, res, next); }
    );

    router.get(
        "/history",
        authMiddleware.verify.bind(authMiddleware),
        (req, res, next) => { void clientMeetingsController.getMeetingsHistory(req, res, next); }
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res, next) => { void clientMeetingsController.getMeetingById(req, res, next); }
    );

    return router;
}