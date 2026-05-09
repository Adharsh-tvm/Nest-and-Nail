import express from 'express';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';
import { IAuthController } from '../../interfaces/IAuthController';

const router = express.Router();

export function createAuthRoutes(
  authController: IAuthController,
  authMiddleware: AuthMiddleware
) {

  router.post("/register", (req, res) => { void authController.register(req, res); });
  router.post("/login", (req, res) => { void authController.login(req, res); });
  router.post("/send-otp", (req, res) => { void authController.sendOtp(req, res); });
  router.post("/verify-otp", (req, res) => { void authController.verifyOtp(req, res); });
  router.post("/forgot-password", (req, res) => { void authController.forgotPassword(req, res); });
  router.post("/reset-password", (req, res) => { void authController.resetPassword(req, res); });
  router.post('/refresh', (req, res) => { void authController.refreshToken(req, res); });
  router.get('/validate', authMiddleware.verify.bind(authMiddleware), (req, res) => { void authController.validate(req, res); });
  router.patch(
    "/change-password",
    authMiddleware.verify.bind(authMiddleware),
    (req, res) => { void authController.changePassword(req, res); }
  );


  return router;
}