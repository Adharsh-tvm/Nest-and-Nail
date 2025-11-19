import { Router } from "express";
import { GoogleAuthController } from "../controllers/GoogleAuthController";

export function createGoogleAuthRoutes(googleAuthController: GoogleAuthController) {
  const router = Router();

  router.post("/google", (req, res) =>
    googleAuthController.googleLogin(req, res)
  );

  return router;
}
