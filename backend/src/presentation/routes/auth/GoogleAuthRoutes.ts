import { Router } from "express";
import { IGoogleAuthController } from "../../interfaces/IGoogleAuthController";

export function createGoogleAuthRoutes(
  googleAuthController: IGoogleAuthController
) {
  const router = Router();
  router.post("/google", (req, res) =>
    googleAuthController.googleLogin(req, res)
  );
  return router;
}
