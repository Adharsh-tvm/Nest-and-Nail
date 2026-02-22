import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IUserController } from "../interfaces/IUserController";
import { IChangeUserRoleUseCase } from "../../application/interfaces/user/IChangeUserRoleUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/user/IGetCurrentUserUseCase";
import {
    AuthenticationError,
    UserBlockedError,
    UserNotFoundError
} from "../../domain/errors/DomainError";
import { IGetAllUsersUseCase } from "../../application/interfaces/admin/IGetAllUsersUseCase";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { LoginResponseDTO } from "../../application/dtos/UserDTO";
import { RESPONSE_MESSAGES } from "../../shared/responses/ResponseMessages";

export class UserController implements IUserController {

    constructor(
        private readonly _changeUserRoleUseCase: IChangeUserRoleUseCase,
        private readonly _getCurrentUserUseCase: IGetCurrentUserUseCase,
    ) { }

    changeRole = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = req.user.id;
            const { role } = req.body;

            const result = await this._changeUserRoleUseCase.execute(userId, role);

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success<LoginResponseDTO>(
                    {
                        user: result.user,
                        accessToken: result.accessToken,
                        refreshToken: result.refreshToken
                    },
                    RESPONSE_MESSAGES.SUCCESS
                )
            );

        } catch (error: unknown) {
            return res.status(HttpStatusCode.FORBIDDEN).json(
                ResponseHandler.error(RESPONSE_MESSAGES.FORBIDDEN, error)
            );
        }
    };



    getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const email = req.params.email;

            const user = await this._getCurrentUserUseCase.execute(email);

            return res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(user, RESPONSE_MESSAGES.USER_FETCHED)
            );

        } catch (error: unknown) {

            if (error instanceof AuthenticationError) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json(
                    ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED, error)
                );
            }

            if (error instanceof UserNotFoundError) {
                return res.status(HttpStatusCode.NOT_FOUND).json(
                    ResponseHandler.error(RESPONSE_MESSAGES.USER_NOT_FOUND, error)
                );
            }

            if (error instanceof UserBlockedError) {
                return res.status(HttpStatusCode.FORBIDDEN).json(
                    ResponseHandler.error(RESPONSE_MESSAGES.USER_BLOCKED, error)
                );
            }

            return res.status(HttpStatusCode.INTERNAL_SERVER).json(
                ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error)
            );
        }
    };

}
