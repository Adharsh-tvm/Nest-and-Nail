import express from "express";
import { IAdminController } from "../../interfaces/IAdminController";
import { ICategoryController } from "../../interfaces/ICategoryController";


export function createAdminRoutes(adminController: IAdminController, categoryController: ICategoryController) {
    const router = express.Router();

    router.get("/clients", (req, res) => adminController.getAllClients(req, res));
    router.get("/workers", (req, res) => adminController.getAllWorkers(req, res));
    router.patch("/verify/:userId", (req, res) => adminController.approveVerification(req, res));
    router.patch("/reject/:userId", (req, res) => adminController.rejectVerification(req, res));
    router.patch("/access/:userId", (req, res) => adminController.updateUserAccess(req, res));

    router.post("/categories", (req, res) => categoryController.create(req, res));
    router.get("/categories", (req, res) => categoryController.getAll(req, res));
    router.put("/categories/:id", (req, res) => categoryController.update(req, res));
    router.patch("/categories/:id/toggle-status", (req, res) => categoryController.updateStatus(req, res))

    return router;
}