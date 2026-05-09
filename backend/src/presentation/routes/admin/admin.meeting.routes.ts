import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { AdminMeetingController } from "../../controllers/admin/AdminMeetingController";

const router = Router();

export function createAdminMeetingRoutes(
    adminMeetingController: AdminMeetingController,
    authMiddleware: AuthMiddleware
) {

    router.get("/meetings", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminMeetingController.getAllMeetings(req, res); });
    router.get("/meetings/:serviceId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminMeetingController.getMeetingById(req, res); });

    return router;
}