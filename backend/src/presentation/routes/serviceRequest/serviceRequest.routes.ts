import express from "express";
import { IServiceRequestController } from "../../interfaces/IServiceRequestController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";


export function createServiceRequestRoutes(
    serviceRequestController: IServiceRequestController,
    authMiddleware: AuthMiddleware
) {
    const router = express.Router();

    router.post("/", (req, res) => serviceRequestController.create(req, res));
    router.post("/:requestId/release", (req, res) => serviceRequestController.release(req, res));
    router.get("/open", (req, res) => serviceRequestController.getOpenRequests(req, res));
    router.post("/:requestId/release", (req, res) => serviceRequestController.reserve(req, res));
    router.get("/my", authMiddleware.verify.bind(authMiddleware), (req, res) => serviceRequestController.getMyRequests(req, res)
    );
    return router;
}