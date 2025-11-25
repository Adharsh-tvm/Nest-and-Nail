import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { IAuthController } from '../interfaces/IAuthController';

const router = express.Router();

export function createAuthRoutes(
  authController: IAuthController,
  authMiddleware: AuthMiddleware
) {

  router.post("/register", (req, res) => authController.register(req, res));
  router.post("/login", (req, res) => authController.login(req, res));
  router.post("/send-otp", (req, res) => authController.sendOtp(req, res));
  router.post("/verify-otp", (req, res) => authController.verifyOtp(req, res));

  return router;
}
 