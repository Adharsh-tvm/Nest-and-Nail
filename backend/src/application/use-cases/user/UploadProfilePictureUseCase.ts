import { ILogger } from "../../../infrastructure/logger/ILogger";
import { Role } from "../../../shared/enums/authEnums";
import { IUploadProfilePictureUseCase } from "../../interfaces/user/IUploadProfilePictureUseCase";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class UploadProfilePictureUseCase implements IUploadProfilePictureUseCase {
    constructor(
        private readonly _repositoryFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger,
        private readonly _s3Service: S3Service
    ) { }

    async execute(userId: string, filePath: string, mimetype: string) {
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

        const key = `users/profile/${userId}-${String(Date.now())}`;
        await this._s3Service.uploadFile(filePath, key, mimetype);

        // Store the KEY in the database, not the full URL
        user.profilePictureUrl = key;

        await repo.updateById(userId, user);

        // Return a signed URL so the frontend can display it immediately
        const signedUrl = await this._s3Service.getPresignedDownloadUrl(key);

        return { url: signedUrl, key };
    }
}

