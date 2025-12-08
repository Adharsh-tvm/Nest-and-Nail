// application/usecases/UpdateUserProfileUseCase.ts

import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { ILogger } from "../interfaces/ILogger";
import { Role } from "../../domain/enums/enums";
import { IUpdateUserProfileUseCase } from "../interfaces/IUpdateUserProfileUseCase";
import { UserResponseDTO } from "../dtos/UserDTO";
import { UserMapper } from "../mappers/UserMapper";
import { User } from "../../domain/entities/User";
import { IUploadProfilePictureUseCase } from "../interfaces/IUploadProfilePictureUseCase";

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {

    constructor(
        private readonly _repositoryFactory: UserRepositoryFactory,
        private readonly _logger: ILogger,
        private readonly _uploadProfilePictureUseCase: IUploadProfilePictureUseCase,
    ) { }

    async execute(
        userId: string,
        updates: Partial<User>,
        profilePictureFilePath?: string
    ): Promise<UserResponseDTO> {

        this._logger.info(`[UpdateUserProfileUseCase] Updating profile for user ${userId}`);

        // Always search both repos
        const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);
        const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);

        let repo = workerRepo;
        let user = await workerRepo.findById(userId);

        if (!user) {
            user = await clientRepo.findById(userId);
            repo = clientRepo;
        }

        if (!user) throw new Error("User not found");

        let updatedUser: any = { ...user, ...updates };

        // Upload profile picture if provided
        if (profilePictureFilePath) {
            const { url } = await this._uploadProfilePictureUseCase.execute(userId, profilePictureFilePath);
            updatedUser.profilePictureUrl = url;
        }

        // NEVER modify role — keep user.role as it is
        updatedUser.role = user.role;

        // Normal save (NO role conversion)
        const saved = await repo.updateById(userId, updatedUser);

        if (!saved) throw new Error("Failed to update user profile");

        return UserMapper.toResponseDTO(saved);
    }
}
