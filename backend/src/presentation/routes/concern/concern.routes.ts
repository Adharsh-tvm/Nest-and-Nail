import express from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { ConcernController } from "../../controllers/concern/ConcernController";
import { upload } from "../../middlewares/multerMiddleware";

export const concernRoutes = (authMiddleware: AuthMiddleware, controller: ConcernController) => {
  const router = express.Router();

  router.post(
    "/",
    authMiddleware.verify.bind(authMiddleware),
    upload.array("images", 5),
    controller.createConcern
  );
  router.get("/", authMiddleware.verify.bind(authMiddleware), controller.getMyConcerns);

  return router;
};