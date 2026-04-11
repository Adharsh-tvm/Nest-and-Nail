import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ClientServiceController } from "../../controllers/client/ClientServiceController";
import { VideoCallController } from "../../controllers/common/videoCallController";


const router = Router();

export function createUsersVideoCallRoutes(
    authMiddleware: AuthMiddleware,
    videoCallController : VideoCallController
) {

    router.post("/join/:serviceId", authMiddleware.verify.bind(authMiddleware), videoCallController.joinCall);

    router.post("/end/:serviceId", authMiddleware.verify.bind(authMiddleware), videoCallController.endCall);

    return router;
}