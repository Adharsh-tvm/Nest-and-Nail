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
        clientMeetingsController.getScheduledMeetings
    );

    router.get(
        "/history",
        authMiddleware.verify.bind(authMiddleware),
        clientMeetingsController.getMeetingsHistory
    );

    router.get(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        clientMeetingsController.getMeetingById
    );

    router.post(
        "/create/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        clientMeetingsController.createVideoCall
    );

    return router;
}