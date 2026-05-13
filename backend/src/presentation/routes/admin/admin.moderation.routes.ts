import { Router } from "express";
import { AdminModerationController } from "../../controllers/admin/AdminModerationController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

export function createAdminModerationRoutes(
    adminModerationController: AdminModerationController,
    authMiddleware: AuthMiddleware
) {
    router.post(
        "/process",
        authMiddleware.adminOnly.bind(authMiddleware),
        (req, res) => { void adminModerationController.processModeration(req, res); }
    );

    return router;
}
