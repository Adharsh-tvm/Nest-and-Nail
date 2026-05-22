import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { VideoCallController } from "../../controllers/common/videoCallController";


const router = Router();

export function createUsersVideoCallRoutes(
    authMiddleware: AuthMiddleware,
    videoCallController : VideoCallController
) {

    router.post("/join/:serviceId", authMiddleware.verify.bind(authMiddleware), (req, res) => { void videoCallController.joinCall(req, res); });

    router.post("/end/:serviceId", authMiddleware.verify.bind(authMiddleware), (req, res) => { void videoCallController.endCall(req, res); });

    router.post("/leave/:serviceId", authMiddleware.verify.bind(authMiddleware), (req, res) => { void videoCallController.leaveCall(req, res); });

    return router;
}