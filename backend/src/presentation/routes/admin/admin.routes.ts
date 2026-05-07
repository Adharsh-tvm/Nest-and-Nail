import express from "express";
import { IAdminController } from "../../interfaces/IAdminController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export function createAdminRoutes(adminController: IAdminController, authMiddleware: AuthMiddleware) {
    const router = express.Router();

    router.get("/clients", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.getAllClients(req, res));
    router.get("/workers", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.getAllWorkers(req, res));
    router.get("/users/all", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.getAllUsers(req, res));
    router.patch("/verify/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.approveVerification(req, res));
    router.patch("/reject/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.rejectVerification(req, res));
    router.patch("/access/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.updateUserAccess(req, res));
    router.get("/dashboard", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.getDashboardData(req, res));

    return router;
}