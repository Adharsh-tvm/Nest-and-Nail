// presentation/controllers/UserProfileController.ts

import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IUpdateUserProfileUseCase } from "../../application/interfaces/IUpdateUserProfileUseCase";
import { IUserProfileController } from "../interfaces/IUserProfileController";

export class UserProfileController implements IUserProfileController {

    constructor(
        private readonly updateUserProfileUseCase: IUpdateUserProfileUseCase
    ) {}

    /**
     * Supports:
     *  - JSON body: { name, phone, ... }
     *  - Optional file (req.file) for profile picture
     * 
     * Route example:
     *  PUT /api/users/:userId/profile
     *  with multer.single("profilePicture")
     */
    updateProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            const updates = req.body;                // name, phone, etc.
            const profilePictureFilePath = req.file?.path; // from multer

            const updatedUser = await this.updateUserProfileUseCase.execute(
                userId,
                updates,
            );

            return res.status(HttpStatusCode.OK).json({
                success: true,
                user: updatedUser
            });

        } catch (error: any) {
            return res
                .status(HttpStatusCode.INTERNAL_SERVER)
                .json({ success: false, message: error.message });
        }
    };
}
