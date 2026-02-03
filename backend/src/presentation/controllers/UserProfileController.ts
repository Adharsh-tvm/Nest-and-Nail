import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IUpdateUserProfileUseCase } from "../../application/interfaces/IUpdateUserProfileUseCase";
import { IUserProfileController } from "../interfaces/IUserProfileController";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../shared/responses/ResponseMessages";
import { IUpdateUserSkillsUseCase } from "../../application/interfaces/user/IUpdateUserSkillsUseCase";
import { IUpdateUserAddressUseCase } from "../../application/interfaces/user/IUpdateUserAddressUseCase";
import { IUpdateWorkerCategoriesUseCase } from "../../application/interfaces/worker/IUpdateWorkerCategoriesUseCase";

export class UserProfileController implements IUserProfileController {

    constructor(
        private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
        private readonly _updateUserSkillsUseCase: IUpdateUserSkillsUseCase,
        private readonly _updatUserAddressUseCase: IUpdateUserAddressUseCase,
        private readonly _updateWorkerCategoriesUseCase: IUpdateWorkerCategoriesUseCase
    ) { }

    updateProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = req.params.userId;
            const profilePictureFilePath = req.file?.path;

            const updates: any = {
                ...req.body,
            };

            if (req.body.isOnline !== undefined) {
                updates.isOnline = req.body.isOnline === "true";
            }

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
                ResponseHandler.success(updateUser, RESPONSE_MESSAGES.SKILLS_UPDATED)
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

    updateAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = req.params;
            const data = req.body;

            const result = await this._updatUserAddressUseCase.execute(
                userId,
                data
            );

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    result,
                    RESPONSE_MESSAGES.ADDRESS_UPDATED
                )
            )
        } catch (error: unknown) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(RESPONSE_MESSAGES.FAILED, error)
            )
        }
    }

    updateCategories = async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.userId;
        const { categoryIds } = req.body;

        if (!Array.isArray(categoryIds)) {
            res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error("categoryIds must be an array")
            );
            return;
        }

        const updatedUser = await this._updateWorkerCategoriesUseCase.execute(
            userId,
            categoryIds
        );

        res.status(HttpStatusCode.OK).json(
            ResponseHandler.success(
                updatedUser,
                RESPONSE_MESSAGES.UPDATED
            )
        );
    }
}
