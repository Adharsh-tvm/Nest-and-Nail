import express from "express";
import { IServiceRequestController } from "../../interfaces/IServiceRequestController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";


export function createServiceRequestRoutes(
    serviceRequestController: IServiceRequestController,
    authMiddleware: AuthMiddleware
) {
    const router = express.Router();

    router.post(
        "/",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.create(req, res)
    );

    router.get(
        "/open",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.getOpenRequests(req, res)
    );

    router.post(
        "/:requestId/reserve",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.reserve(req, res)
    );

    router.post(
        "/:requestId/release",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.release(req, res)
    );

    router.get(
        "/my",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.getMyRequests(req, res)
    );

    router.get(
        "/:requestId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.getById(req, res)
    );

    return router;
}
