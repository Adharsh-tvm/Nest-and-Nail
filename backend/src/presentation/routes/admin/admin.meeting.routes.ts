import { Router } from "express";
import { AdminServiceController } from "../../controllers/admin/AdminServiceController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { AdminMeetingController } from "../../controllers/admin/AdminMeetingController";

const router = Router();

export function createAdminMeetingRoutes(
    adminMeetingController: AdminMeetingController,
    authMiddleware: AuthMiddleware
) {

    router.get("/meetings", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminMeetingController.getAllMeetings(req, res));
    router.get("/meetings/:serviceId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminMeetingController.getMeetingById(req, res));

    return router;
}