import { Router } from "express";
import { ClientReviewController } from "../../controllers/client/ClientReviewController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export const clientReviewRoutes = (
    authMiddleware: AuthMiddleware,
    controller: ClientReviewController
) => {
    const router = Router();

    router.post(
        "/:serviceId",
        authMiddleware.verify.bind(authMiddleware),
        controller.addReview
    );

    return router;
};