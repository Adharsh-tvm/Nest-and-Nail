import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { ILogger } from "../interfaces/ILogger";
import { Role } from "../../shared/enums/enums";
import { CloudinaryUploadService } from "../../infrastructure/services/CloudinaryUploadService";
import { IUploadProfilePictureUseCase } from "../interfaces/IUploadProfilePictureUseCase";

export class UploadProfilePictureUseCase implements IUploadProfilePictureUseCase {
    constructor(
        private readonly _repositoryFactory: UserRepositoryFactory,
        private readonly _logger: ILogger
    ) {}

    async execute(workerId: string, filePath: string) {
        this._logger.info(`[UploadProfilePictureUseCase] Uploading profile picture for worker: ${workerId}`);

        const repo = this._repositoryFactory.getRepository(Role.WORKER);
        const worker = await repo.findById(workerId);

        if (!worker) throw new Error("Worker not found");

        const url = await CloudinaryUploadService.upload(filePath, "workers/profile");

        worker.profilePictureUrl = url;
        await repo.updateById(workerId, worker);

        return { url };
    }
}
