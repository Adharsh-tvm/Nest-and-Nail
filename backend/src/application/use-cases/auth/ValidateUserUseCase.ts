import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { IValidateUserUseCase } from "../../interfaces/auth/IValidateUserUseCase";
import { Role } from "../../../shared/enums/authEnums";
import { User } from "../../../domain/entities/User";

export class ValidateUserUseCase implements IValidateUserUseCase {
    constructor(private _userRepositoryFactory: IUserRepositoryFactory) { }

    async execute(userId: string): Promise<{
        success: boolean;
        payload?: {
            id: string;
            role: string;
            isBlocked: boolean;
        };
        message?: string;
    }> {
        let user: User | null = null;
        let userRole: string | null = null;

        try {
            const clientRepo = this._userRepositoryFactory.getRepository(Role.CLIENT);
            user = await clientRepo.findById(userId);
            if (user) userRole = Role.CLIENT;
        } catch {
            // clientRepo lookup failed, proceed to workerRepo
        }

        if (!user) {
            try {
                const workerRepo = this._userRepositoryFactory.getRepository(Role.WORKER);
                user = await workerRepo.findById(userId);
                if (user) userRole = Role.WORKER;
            } catch {
                // workerRepo lookup failed, proceed to adminRepo
            }
        }

        if (!user) {
            try {
                const adminRepo = this._userRepositoryFactory.getRepository(Role.ADMIN);
                user = await adminRepo.findById(userId);
                if (user) userRole = Role.ADMIN;
            } catch {
                // adminRepo lookup failed, user not found
            }
        }

        if (!user || !userRole) {
            return {
                success: false,
                message: "User not found",
            };
        }

        if (user.isBlocked) {
            return {
                success: false,
                message: "User is blocked",
            };
        }

        return {
            success: true,
            payload: {
                id: user.userId,
                role: userRole,
                isBlocked: !!user.isBlocked,
            },
        };
    }
}
