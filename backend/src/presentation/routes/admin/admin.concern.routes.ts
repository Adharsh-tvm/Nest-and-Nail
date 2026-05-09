import express from "express";
import { AdminConcernController } from "../../controllers/admin/AdminConcernController ";

export const adminConcernRoutes = (controller: AdminConcernController) => {
  const router = express.Router();

  router.get("/", (req, res) => { void controller.getAllConcerns(req, res); });

  return router;
};