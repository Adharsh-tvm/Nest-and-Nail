import { Router } from "express";
import { AdminServiceController } from "../../controllers/admin/AdminServiceController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

const router = Router();

export function createAdminServiceRoutes(
    adminServiceController: AdminServiceController,
    authMiddleware: AuthMiddleware
) {

    router.get(
        "/",
        authMiddleware.adminOnly.bind(authMiddleware),
        (req, res) => adminServiceController.getAllServices(req, res)
    );

    router.get(
        "/:serviceId",
        authMiddleware.adminOnly.bind(authMiddleware),
        (req, res) => adminServiceController.getServiceDetails(req, res)
    );

    return router;
}