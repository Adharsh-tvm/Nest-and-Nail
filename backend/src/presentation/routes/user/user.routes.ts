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
        (req, res) => { void userController.changeRole(req, res); }
    );


    router.get("/current/:email", (req, res) => { void userController.getCurrentUser(req, res); }
    );

    router.put(
        "/user/:userId/profile",
        authMiddleware.verify.bind(authMiddleware),
        upload.single("profilePicture"),
        (req, res) => { void userProfileController.updateProfile(req, res); }
    );

    router.patch(
        "/:userId/skills",
        authMiddleware.verify,
        (req, res) => { void userProfileController.updateSkills(req, res); }
    );

    router.post(
        "/:userId/addresses",
        authMiddleware.verify,
        (req, res) => { void userProfileController.addAddress(req, res); }
    );

    router.put(
        "/:userId/addresses/:addressId",
        authMiddleware.verify,
        (req, res) => { void userProfileController.editAddress(req, res); }
    );

    router.delete(
        "/:userId/addresses/:addressId",
        authMiddleware.verify,
        (req, res) => { void userProfileController.deleteAddress(req, res); }
    );

    return router;
}