import express from "express";
import { ICategoryController } from "../../interfaces/ICategoryController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export function createCategoryRoutes(categoryController: ICategoryController, authMiddleware: AuthMiddleware) {
    const router = express.Router();

    const adminOnly = authMiddleware.adminOnly.bind(authMiddleware);

    router.post("/", adminOnly, (req, res) => { void categoryController.create(req, res); });
    router.get("/", adminOnly, (req, res) => { void categoryController.getAll(req, res); });
    router.put("/:id", adminOnly, (req, res) => { void categoryController.update(req, res); });
    router.patch("/:id/toggle-status", adminOnly, (req, res) => { void categoryController.updateStatus(req, res); });

    return router;
}

export function createUserCategoryRoutes(categoryController: ICategoryController, authMiddleware: AuthMiddleware) {
    const router = express.Router();

    router.get("/", (req, res) => { void categoryController.getAll(req, res); }); 
    router.patch("/:userId", authMiddleware.verify.bind(authMiddleware), (req, res) => { void categoryController.updateUserCategories(req, res); });

    return router;
}
