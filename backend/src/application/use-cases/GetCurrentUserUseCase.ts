import { AuthenticationError, UserBlockedError, UserNotFoundError } from "../../domain/errors/DomainError";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { LoginResponseDTO, UserResponseDTO } from "../dtos/UserDTO";
import { IGetCurrentUserUseCase } from "../interfaces/IGetCurrentUserUseCase";
import { ILogger } from "../interfaces/ILogger";
import { UserMapper } from "../mappers/UserMapper";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
    constructor(
        private readonly _clientRepository: IClientRepository,
        private readonly _logger: ILogger,
    ) { }

    /**
 * Returns the sanitized current user (DTO) for a given userId.
 * Throws:
 * - NotAuthenticatedError if userId is missing
 * - UserNotFoundError if the user does not exist
 * - UserBlockedError if the user is blocked
 */

    async execute(userId: string | null): Promise<UserResponseDTO> {
        if (!userId) {
            this._logger.warn(`[GetCurrentUserUseCase] Missing userId in context`);
            throw new AuthenticationError();
        }

        const user = await this._clientRepository.findById(userId);

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