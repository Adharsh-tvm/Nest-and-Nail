import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IUpdateUserProfileUseCase } from "../../application/interfaces/IUpdateUserProfileUseCase";
import { IUserProfileController } from "../interfaces/IUserProfileController";
import { ResponseHandler } from "../responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../responses/ResponseMessages";
import { IUpdateUserSkillsUseCase } from "../../application/interfaces/IUpdateUserSkillsUseCase";

export class UserProfileController implements IUserProfileController {

    constructor(
        private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
        private readonly _updateUserSkillsUseCase: IUpdateUserSkillsUseCase
    ) { }

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

    updateSkills = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = req.params;
            const { skills } = req.body;

            if (!Array.isArray(skills)) {
                return res.status(HttpStatusCode.BAD_REQUEST).json(
                    ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST
                    )
                )
            }

            const updateUser = await this._updateUserSkillsUseCase.execute(userId, skills);

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(updateUser, RESPONSE_MESSAGES.SKILLS_UPDATED
                )
            );
        } catch (error: unknown) {
            console.error("[UpdateUserSkillsController] Error:", error);

            return res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error(
                    RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
                    error
                )
            )
        }
    }
}
