import express from "express";
import { IAdminController } from "../interfaces/IAdminController";


export function createAdminRoutes(adminController: IAdminController) {
    const router = express.Router();

    router.get("/clients", (req, res) => adminController.getAllClients(req,res));
    router.get("/workers", (req, res) => adminController.getAllWorkers(req,res));

    return router;

}