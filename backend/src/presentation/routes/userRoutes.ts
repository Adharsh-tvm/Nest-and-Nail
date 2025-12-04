import { Router } from "express";
import { IUserController } from "../interfaces/IUserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

export function createUserRoutes(
    userController: IUserController,
    authMiddleware: AuthMiddleware
) {
    router.patch("/mode",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => userController.changeRole(req, res)
    );

    // user.routes.ts
    router.get("/current/:email", (req, res) =>
        userController.getCurrentUser(req, res)
    );

    return router;
}