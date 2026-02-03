import express from "express";
import { IServiceRequestController } from "../../interfaces/IServiceRequestController";


export function createServiceRequestRoutes(
    serviceRequestController: IServiceRequestController
) {
    const router = express.Router();

    router.post("/", (req, res) => serviceRequestController.create(req, res));
    router.post("/:requestId/release", (req, res) => serviceRequestController.release(req, res));
    router.get("/open", (req, res) => serviceRequestController.getOpenRequests(req, res));
    router.post(":requestId/release", (req, res) => serviceRequestController.reserve(req, res));

    return router;
}