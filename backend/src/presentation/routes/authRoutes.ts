import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = express.Router();

export function createClientRoutes(
    authController: AuthController,
    authMiddleware: AuthMiddleware
) {
    router.post("/register", (req, res) => authController.register(req, res));
    router.post("/login", (req, res) => authController.login(req, res));
    router.post("/logout", (req, res) => authController.logout(req, res));
    router.get("/me", authMiddleware.verify, (req, res) => authController.getCurrentUser(req, res));
    
    return router;
}   