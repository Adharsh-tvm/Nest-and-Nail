import express from "express";
import { IAdminController } from "../../interfaces/IAdminController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export function createAdminRoutes(adminController: IAdminController, authMiddleware: AuthMiddleware) {
    const router = express.Router();

    router.get("/clients", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.getAllClients(req, res); });
    router.get("/workers", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.getAllWorkers(req, res); });
    router.get("/users/all", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.getAllUsers(req, res); });
    router.patch("/verify/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.approveVerification(req, res); });
    router.patch("/reject/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.rejectVerification(req, res); });
    router.patch("/access/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.updateUserAccess(req, res); });
    router.patch("/suspend/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.toggleUserSuspension(req, res); });
    router.get("/dashboard", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => { void adminController.getDashboardData(req, res); });

    return router;
}