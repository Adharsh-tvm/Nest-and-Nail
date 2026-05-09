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
        (req, res) => { void clientMeetingsController.getScheduledMeetings(req, res); }
    );

    router.get(
        "/history",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void clientMeetingsController.getMeetingsHistory(req, res); }
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void clientMeetingsController.getMeetingById(req, res); }
    );

    return router;
}