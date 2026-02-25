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
        "/my",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.getMyRequests(req, res)
    );

    router.get(
        "/:requestId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.getById(req, res)
    );

    router.get(
        "/admin/all",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.getAllForAdmin(req, res)
    );

    router.delete(
        "/:requestId",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => serviceRequestController.delete(req, res)
    );

    router.post(
        "/dispatch/:requestId",
        authMiddleware.verify.bind(authMiddleware),
        (req,res) => serviceRequestController.dispatch(req,res)
    )

    

    return router;
}
