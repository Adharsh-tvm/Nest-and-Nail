import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();

export function createClientRoutes(
    authController: AuthController,
) {
    router.post("/register", (req, res) => authController.register(req, res));
    router.post("/login", (req, res) => authController.login(req, res));
    router.post("/logout", (req, res) => authController.logout(req, res));
    return router;
}   