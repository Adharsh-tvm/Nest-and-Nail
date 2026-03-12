import express from "express";
import { ICategoryController } from "../../interfaces/ICategoryController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export function createCategoryRoutes(categoryController: ICategoryController, authMiddleware: AuthMiddleware) {
    const router = express.Router();

    const adminOnly = authMiddleware.adminOnly.bind(authMiddleware);

    router.post("/", adminOnly, (req, res) => categoryController.create(req, res));
    router.get("/", adminOnly, (req, res) => categoryController.getAll(req, res));
    router.put("/:id", adminOnly, (req, res) => categoryController.update(req, res));
    router.patch("/:id/toggle-status", adminOnly, (req, res) => categoryController.updateStatus(req, res));

    return router;
}

export function createUserCategoryRoutes(categoryController: ICategoryController, authMiddleware: AuthMiddleware) {
    const router = express.Router();

    // User routes for categories
    router.get("/", (req, res) => categoryController.getAll(req, res)); // Assuming public or handled by frontend
    router.patch("/:userId", authMiddleware.verify.bind(authMiddleware), (req, res) => categoryController.updateUserCategories(req, res));

    return router;
}
