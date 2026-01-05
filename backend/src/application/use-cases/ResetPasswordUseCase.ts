import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { ILogger } from "../interfaces/ILogger";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { Role } from "../../shared/enums/authEnums";
import { IResetPasswordUseCase } from "../interfaces/IResetPasswordUseCase";
import { IUserRepositoryFactory } from "../../domain/repositories/IUserRepositoryFactory";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
    constructor(
        private readonly _repositoryFactory: IUserRepositoryFactory,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _otpRepo: IOtpRepository,
        private readonly _logger: ILogger
    ) { }

    async execute(email: string, newPassword: string): Promise<void> {
        const roles = [Role.CLIENT, Role.WORKER, Role.ADMIN];

        let user = null;
        let userRole: Role | null = null;

        for (const role of roles) {
            const repo = this._repositoryFactory.getRepository(role);
            const found = await repo.findByEmail(email);
            if (found) {
                user = found;
                userRole = role;
                break;
            }
        }

        if (!user || !userRole) {
            throw new Error("User not found");
        }

        const hashedPassword = await this._passwordHasher.hash(newPassword);

        const repo = this._repositoryFactory.getRepository(userRole);

        await repo.update(user.email, { passwordhash: hashedPassword });

        await this._otpRepo.delete(email);

        this._logger?.info(`Password reset successful for ${email}`);
    }
}
