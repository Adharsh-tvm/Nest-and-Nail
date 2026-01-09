import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IUpdateUserProfileUseCase } from "../../application/interfaces/IUpdateUserProfileUseCase";
import { IUserProfileController } from "../interfaces/IUserProfileController";
import { ResponseHandler } from "../responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../responses/ResponseMessages";

export class UserProfileController implements IUserProfileController {

    constructor(
        private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase
    ) { }

    /**
     * Supports:
     *  - JSON body: { name, phone, ... }
     *  - Optional file (req.file) for profile picture
     * 
     * Route example:
     *  PUT /api/users/:userId/profile
     *  with multer.single("profilePicture")
     */
    updateProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = req.params.userId;
            const updates = req.body;
            const profilePictureFilePath = req.file?.path;

            const updatedUser = await this._updateUserProfileUseCase.execute(
                userId,
                updates,
                profilePictureFilePath
            );

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    updatedUser,
                    RESPONSE_MESSAGES.USER_UPDATED
                )
            );

        } catch (error: unknown) {
            console.error("[UpdateUserProfileController] Error:", error);

            return res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error(
                    RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
                    error
                )
            );
        }
    };
}
