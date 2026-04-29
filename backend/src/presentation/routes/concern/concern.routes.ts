import express from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ConcernController } from "../../controllers/concern/ConcernController";

export const concernRoutes = (authMiddleware: AuthMiddleware, controller: ConcernController) => {
  const router = express.Router();

  router.post("/", authMiddleware.verify.bind(authMiddleware), controller.createConcern);
  router.get("/", authMiddleware.verify.bind(authMiddleware), controller.getMyConcerns);

  return router;
};