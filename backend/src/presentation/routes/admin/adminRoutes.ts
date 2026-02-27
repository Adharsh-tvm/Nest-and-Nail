import express from "express";
import { IAdminController } from "../../interfaces/IAdminController";
import { ICategoryController } from "../../interfaces/ICategoryController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";


export function createAdminRoutes(adminController: IAdminController, categoryController: ICategoryController, authMiddleware: AuthMiddleware) {
    const router = express.Router();

    router.get("/clients", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.getAllClients(req, res));
    router.get("/workers", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.getAllWorkers(req, res));
    router.get("/users/all", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.getAllUsers(req, res));
    router.patch("/verify/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.approveVerification(req, res));
    router.patch("/reject/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.rejectVerification(req, res));
    router.patch("/access/:userId", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => adminController.updateUserAccess(req, res));

    router.post("/categories", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => categoryController.create(req, res));
    router.get("/categories", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => categoryController.getAll(req, res));
    router.put("/categories/:id", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => categoryController.update(req, res));
    router.patch("/categories/:id/toggle-status", authMiddleware.adminOnly.bind(authMiddleware), (req, res) => categoryController.updateStatus(req, res))

    return router;
}