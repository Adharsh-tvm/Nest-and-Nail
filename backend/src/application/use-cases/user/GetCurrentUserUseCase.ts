import { AuthenticationError, UserBlockedError, UserNotFoundError } from "../../../domain/errors/DomainError";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { IGetCurrentUserUseCase } from "../../interfaces/user/IGetCurrentUserUseCase";
import { ILogger } from "../../../infrastructure/logger/ILogger";
import { UserMapper } from "../../mappers/UserMapper";
import { Role } from "../../../shared/enums/authEnums";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
    constructor(
        private readonly _repositoryFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger,
        private readonly _s3Service: S3Service
    ) { }

    async execute(email: string | null): Promise<UserResponseDTO> {
        if (!email) {
            this._logger.warn("[GetCurrentUserUseCase] Missing email in context");
            throw new AuthenticationError();
        }

        this._logger.info(`[GetCurrentUserUseCase] Finding user with ID: ${email}`);

        let user = null;

        try {
            const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);
            user = await clientRepo.findByEmail(email);

            if (user) {
                this._logger.info(`[GetCurrentUserUseCase] User found as CLIENT`);
            }
        } catch (error) {
            // Continue to next repository
        }

        if (!user) {
            try {
                const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);
                user = await workerRepo.findByEmail(email);
                if (user) {
                    this._logger.info(`[GetCurrentUserUseCase] User found as WORKER`);
                }
            } catch (error) {
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

        // Generate Presigned URL for profile picture
        if (user.profilePictureUrl) {
            // Check if it's already a full URL (legacy) or a key
            if (!user.profilePictureUrl.startsWith("http")) {
                user.profilePictureUrl = await this._s3Service.getPresignedDownloadUrl(user.profilePictureUrl);
            }
        }

        return UserMapper.toResponseDTO(user);
    }
}