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
    ) {}

    async execute(userId: string | null): Promise<UserResponseDTO> {
        if (!userId) {
            this._logger.warn("[GetCurrentUserUseCase] Missing userId in context");
            throw new AuthenticationError();
        }

        this._logger.info(`[GetCurrentUserUseCase] Finding user with ID: ${userId}`);

        // Try to find user across all repositories
        let user = null;

        // Search in Client repository
        try {
            const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);
            user = await clientRepo.findById(userId);
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
                user = await workerRepo.findById(userId);
                if (user) {
                    this._logger.info(`[GetCurrentUserUseCase] User found as WORKER`);
                }
            } catch (error) {
                // Continue
            }
        }

        if (!user) {
            this._logger.warn(`[GetCurrentUserUseCase] User not found: ${userId}`);
            throw new UserNotFoundError();
        }

        if (user.isBlocked) {
            this._logger.warn(`[GetCurrentUserUseCase] User is blocked: ${userId}`);
            throw new UserBlockedError();
        }

        return UserMapper.toResponseDTO(user);
    }
}