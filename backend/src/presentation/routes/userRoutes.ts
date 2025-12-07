import { Router } from "express";
import { IUserController } from "../interfaces/IUserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { IUserProfileController } from "../interfaces/IUserProfileController";

const router = Router();

export function createUserRoutes(
    userController: IUserController,
    userProfileController: IUserProfileController,
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

    router.put(
        "/user/:userId/profile",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => userProfileController.updateProfile(req, res)
    );

    router.put(
        "/users/:userId/profile",
        upload.single("profilePicture"),  
        userProfileController.updateProfile
    );


    return router;
}