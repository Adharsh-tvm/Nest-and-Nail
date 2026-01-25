import express from "express";
import { IAdminController } from "../../interfaces/IAdminController";


export function createAdminRoutes(adminController: IAdminController) {
    const router = express.Router();

    router.get("/clients", (req, res) => adminController.getAllClients(req, res));
    router.get("/workers", (req, res) => adminController.getAllWorkers(req, res));
    router.patch("/verify/:userId", (req, res) => adminController.approveVerification(req, res));
    router.patch("/reject/:userId", (req, res) => adminController.rejectVerification(req, res));
    router.patch("/access/:userId", (req, res) => adminController.updateUserAccess(req, res));

    return router;
}