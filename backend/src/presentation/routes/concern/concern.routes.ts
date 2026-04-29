import express from "express";
import { ConcernController } from "../../controllers/concern/ConcernController";

export const concernRoutes = (controller: ConcernController) => {
  const router = express.Router();

  router.post("/", controller.createConcern);
  router.get("/", controller.getMyConcerns);

  return router;
};