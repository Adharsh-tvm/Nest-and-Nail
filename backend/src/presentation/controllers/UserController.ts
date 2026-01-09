import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IUserController } from "../interfaces/IUserController";
import { IChangeUserRoleUseCase } from "../../application/interfaces/IChangeUserRoleUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import {
    AuthenticationError,
    UserBlockedError,
    UserNotFoundError
} from "../../domain/errors/DomainError";
import { IGetAllUsersUseCase } from "../../application/interfaces/IGetAllUsersUseCase";
import { ResponseHandler } from "../responses/ApiResponse";
import { LoginResponseDTO } from "../../application/dtos/UserDTO";
import { RESPONSE_MESSAGES } from "../responses/ResponseMessages";

export class UserController implements IUserController {

    constructor(
        private readonly _changeUserRoleUseCase: IChangeUserRoleUseCase,
        private readonly _getCurrentUserUseCase: IGetCurrentUserUseCase,
        private readonly _getAllUsersUseCase: IGetAllUsersUseCase
    ) { }

    changeRole = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { role } = req.body;

            const result = await this._changeUserRoleUseCase.execute(userId, role);

            return res.status(HttpStatusCode.OK).json(ResponseHandler.success<LoginResponseDTO>({
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }, RESPONSE_MESSAGES.SUCCESS));

        } catch (error: any) {
            return res
                .status(HttpStatusCode.INTERNAL_SERVER)
                .json(ResponseHandler.error(RESPONSE_MESSAGES.FORBIDDEN, error));
        }
    };



    getCurrentUser = async (req: Request, res: Response) => {
        try {
            const email = req.params.email;

            const user = await this._getCurrentUserUseCase.execute(email);

            return res.status(HttpStatusCode.OK).json({
                success: true,
                user
            });

        } catch (error: any) {

            if (error instanceof AuthenticationError) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Authentication failed"
                });
            }

            if (error instanceof UserNotFoundError) {
                return res.status(HttpStatusCode.NOT_FOUND).json({
                    success: false,
                    message: "User not found"
                });
            }

            if (error instanceof UserBlockedError) {
                return res.status(HttpStatusCode.FORBIDDEN).json({
                    success: false,
                    message: "User is blocked"
                });
            }

            return res
                .status(HttpStatusCode.INTERNAL_SERVER)
                .json({ success: false, message: "Internal server error" });
        }
    };

    getAllUsers = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this._getAllUsersUseCase.execute();
            console.log("users -----------", users)
            return res.status(HttpStatusCode.OK).json({ users });
        } catch (error) {
            console.error("Error fetching all users: ", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: "Internal server error" });
        }
    }
}
