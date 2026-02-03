import { ILogger } from "../../../infrastructure/logger/ILogger";
import { Role } from "../../../shared/enums/authEnums";
import { CloudinaryUploadService } from "../../../infrastructure/adapters/CloudinaryUploadService";
import { IUploadProfilePictureUseCase } from "../../interfaces/user/IUploadProfilePictureUseCase";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";

export class UploadProfilePictureUseCase implements IUploadProfilePictureUseCase {
    constructor(
        private readonly _repositoryFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger
    ) { }

    async execute(userId: string, filePath: string) {
        this._logger.info(`[UploadProfilePictureUseCase] Uploading profile picture for user: ${userId}`);

        const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);
        const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);

        let repo = workerRepo;
        let user = await workerRepo.findById(userId);

        if (!user) {
            user = await clientRepo.findById(userId);
            repo = clientRepo;
        }

        if (!user) throw new Error("User not found");

        const url = await CloudinaryUploadService.upload(filePath, "users/profile");

        user.profilePictureUrl = url;

        await repo.updateById(userId, user);

        return { url };
    }
}

