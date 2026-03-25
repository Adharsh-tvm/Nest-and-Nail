import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { IUserProfileController } from "../../interfaces/IUserProfileController";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";
import { IUpdateUserSkillsUseCase } from "../../../application/interfaces/user/IUpdateUserSkillsUseCase";
import { IUpdateWorkerCategoriesUseCase } from "../../../application/interfaces/worker/profile/IUpdateWorkerCategoriesUseCase";
import { IUpdateUserProfileUseCase } from "../../../application/interfaces/user/IUpdateUserProfileUseCase";
import { IAddUserAddressUseCase } from "../../../application/interfaces/address/IUpdateUserAddressUseCase";
import { IEditUserAddressUseCase } from "../../../application/interfaces/address/IEditUserAddressUseCase";
import { IDeleteUserAddressUseCase } from "../../../application/interfaces/address/IDeleteUserAddressUseCase";

export class UserProfileController implements IUserProfileController {

    constructor(
        private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
        private readonly _updateUserSkillsUseCase: IUpdateUserSkillsUseCase,
        private readonly _addUserAddressUseCase: IAddUserAddressUseCase,
        private readonly _editUserAddressUseCase: IEditUserAddressUseCase,
        private readonly _deleteUserAddressUseCase: IDeleteUserAddressUseCase,

    ) { }

    updateProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = req.params.userId;
            const profilePictureFilePath = req.file?.path;
            const mimetype = req.file?.mimetype;

            const updates: any = {
                ...req.body,
            };

            if (req.body.isOnline !== undefined) {
                updates.isOnline = req.body.isOnline === "true";
            }

            const updatedUser = await this._updateUserProfileUseCase.execute(
                userId,
                updates,
                profilePictureFilePath,
                mimetype
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

    addAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = req.params;
            const data = req.body;

            const result = await this._addUserAddressUseCase.execute(
                userId,
                data
            );

            return res.status(HttpStatusCode.CREATED).json(
                ResponseHandler.success(
                    result,
                    RESPONSE_MESSAGES.ADDRESS_UPDATED
                )
            );
        } catch (error: unknown) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(RESPONSE_MESSAGES.FAILED, error)
            );
        }
    };

    editAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId, addressId } = req.params;
            const data = req.body;

            const result = await this._editUserAddressUseCase.execute(
                userId,
                addressId,
                data
            );

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    result,
                    RESPONSE_MESSAGES.ADDRESS_UPDATED
                )
            );
        } catch (error: unknown) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(RESPONSE_MESSAGES.FAILED, error)
            );
        }
    };

    deleteAddress = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId, addressId } = req.params;

            const result = await this._deleteUserAddressUseCase.execute(
                userId,
                addressId
            );

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(
                    result,
                    RESPONSE_MESSAGES.ADDRESS_UPDATED
                )
            );
        } catch (error: unknown) {
            return res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(RESPONSE_MESSAGES.FAILED, error)
            );
        }
    };

}
