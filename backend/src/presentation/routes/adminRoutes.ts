import express from "express";
import { IAdminController } from "../interfaces/IAdminController";


export function createAdminRoutes(adminController: IAdminController) {
    const router = express.Router();

    router.get("/clients", (req, res) => adminController.getAllClients(req, res));
    router.get("/workers", (req, res) => adminController.getAllWorkers(req, res));
    router.patch("/verify/:userId", adminController.approveVerification);
    router.patch("/reject/:userId", adminController.rejectVerification);
    
    return router;
}