import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IUserController } from "../interfaces/IUserController";
import { IChangeUserRoleUseCase } from "../../application/interfaces/IChangeUserRoleUseCase";
import { Role } from "../../shared/enums/enums";

export class UserController implements IUserController {
    constructor(
        private readonly changeUserRoleUseCase: IChangeUserRoleUseCase
    ) { }

    changeRole = async (req: Request, res: Response): Promise<Response> => {
        try {
            console.log("=== ROLE CHANGE REQUEST ===");
            console.log("User ID:", req.user.id);
            console.log("Requested Role:", req.body.role);

            const userId = req.user.id;
            const { role } = req.body;

            if (!Object.values(Role).includes(role)) {
                return res
                    .status(HttpStatusCode.BAD_REQUEST)
                    .json({ message: "Invalid role. Must be 'client' or 'worker'." });
            }

            const updatedUser = await this.changeUserRoleUseCase.execute(userId, role);

            console.log("=== ROLE CHANGE SUCCESS ===");
            console.log("Updated user:", updatedUser);

            return res.status(HttpStatusCode.OK).json(updatedUser);

        } catch (err: any) {
            console.error("[UserController] Error:", err);
            return res
                .status(HttpStatusCode.INTERNAL_SERVER)
                .json({ message: err.message ?? "Internal server error" });
        }
    };
}