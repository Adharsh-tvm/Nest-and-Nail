import { Router } from "express";
import { IUserController } from "../../interfaces/IUserController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { upload } from "../../middlewares/multerMiddleware";
import { IUserProfileController } from "../../interfaces/IUserProfileController";

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


    router.get("/current/:email", (req, res) =>
        userController.getCurrentUser(req, res)
    );

    router.put(
        "/user/:userId/profile",
        authMiddleware.verify.bind(authMiddleware),
        upload.single("profilePicture"),
        (req, res) => userProfileController.updateProfile(req, res)
    );

    router.patch(
        "/:userId/skills",
        authMiddleware.verify,
        userProfileController.updateSkills
    );

    router.post(
        "/:userId/address",
        authMiddleware.verify,
        userProfileController.updateAddress
    );

    router.patch(
        "/:userId/categories",
        authMiddleware.verify,
        userProfileController.updateCategories
    );

    return router;
}