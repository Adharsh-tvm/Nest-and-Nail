import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IUserController } from "../interfaces/IUserController";
import { IChangeUserRoleUseCase } from "../../application/interfaces/IChangeUserRoleUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/IGetCurrentUserUseCase";
import {
    AuthenticationError,
    UserBlockedError,
    UserNotFoundError
} from "../../domain/errors/DomainError";

export class UserController implements IUserController {

    constructor(
        private readonly changeUserRoleUseCase: IChangeUserRoleUseCase,
        private readonly getCurrentUserUseCase: IGetCurrentUserUseCase
    ) {}

    changeRole = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { role } = req.body;

            const result = await this.changeUserRoleUseCase.execute(userId, role);

            return res.status(HttpStatusCode.OK).json({
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            });

        } catch (error: any) {
            return res
                .status(HttpStatusCode.INTERNAL_SERVER)
                .json({ message: error.message ?? "Internal server error" });
        }
    };



    getCurrentUser = async (req: Request, res: Response) => {
        try {
            const email = req.params.email;

            const user = await this.getCurrentUserUseCase.execute(email);   

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
}
