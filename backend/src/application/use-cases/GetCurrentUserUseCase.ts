import { AuthenticationError, UserBlockedError, UserNotFoundError } from "../../domain/errors/DomainError";
import { UserResponseDTO } from "../dtos/UserDTO";
import { IGetCurrentUserUseCase } from "../interfaces/IGetCurrentUserUseCase";
import { ILogger } from "../interfaces/ILogger";
import { UserMapper } from "../mappers/UserMapper";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { Role } from "../../shared/enums/enums";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
    constructor(
        private readonly _repositoryFactory: UserRepositoryFactory,
        private readonly _logger: ILogger,
    ) { }

    async execute(email: string | null): Promise<UserResponseDTO> {
        if (!email) {
            this._logger.warn("[GetCurrentUserUseCase] Missing email in context");
            throw new AuthenticationError();
        }

        this._logger.info(`[GetCurrentUserUseCase] Finding user with ID: ${email}`);

        // Try to find user across all repositories
        let user = null;

        // Search in Client repository
        try {
            const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);
            user = await clientRepo.findByEmail(email);
            if (user) {
                this._logger.info(`[GetCurrentUserUseCase] User found as CLIENT`);
            }
        } catch (error) {
            // Continue to next repository
        }

        // If not found, search in Worker repository
        if (!user) {
            try {
                const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);
                user = await workerRepo.findByEmail(email);
                if (user) {
                    this._logger.info(`[GetCurrentUserUseCase] User found as WORKER`);
                }
            } catch (error) {
                // Continue
            }
        }

        if (!user) {
            try {
                const adminRepo = this._repositoryFactory.getRepository(Role.ADMIN);
                user = await adminRepo.findByEmail(email);
                if (user) {
                    this._logger.info(`[GetCurrentUserUseCase] User found as ADMIN`);
                }
            } catch (error) {
                // Continue
            }
        }

        if (!user) {
            this._logger.warn(`[GetCurrentUserUseCase] User not found: ${email}`);
            throw new UserNotFoundError();
        }

        if (user.isBlocked) {
            this._logger.warn(`[GetCurrentUserUseCase] User is blocked: ${email}`);
            throw new UserBlockedError();
        }

        return UserMapper.toResponseDTO(user);
    }
}