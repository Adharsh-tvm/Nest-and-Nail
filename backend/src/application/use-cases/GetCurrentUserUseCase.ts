import { AuthenticationError, UserBlockedError, UserNotFoundError } from "../../domain/errors/DomainError";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { UserResponseDTO } from "../dtos/UserDTO";
import { IGetCurrentUserUseCase } from "../interfaces/IGetCurrentUserUseCase";
import { ILogger } from "../interfaces/ILogger";
import { UserMapper } from "../mappers/UserMapper";
import { User } from "../../domain/entities/User";

export class GetCurrentUserUseCase<T extends User> implements IGetCurrentUserUseCase {
    constructor(
        private readonly _userRepository: IBaseRepository<T>,
        private readonly _logger: ILogger,
    ) {}

    async execute(userId: string | null): Promise<UserResponseDTO> {
        if (!userId) {
            this._logger.warn("[GetCurrentUserUseCase] Missing userId in context");
            throw new AuthenticationError();
        }

        const user = await this._userRepository.findById(userId);
        
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