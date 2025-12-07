import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { ILogger } from "../interfaces/ILogger";
import { Role } from "../../shared/enums/enums";
import { CloudinaryUploadService } from "../../infrastructure/services/CloudinaryUploadService";
import { IUploadWorkerDocumentUseCase } from "../interfaces/IUploadWorkerDocumentUseCase";

export class UploadWorkerDocumentUseCase implements IUploadWorkerDocumentUseCase {
    constructor(
        private readonly _repositoryFactory: UserRepositoryFactory,
        private readonly _logger: ILogger
    ) {}

    async execute(userId: string, filePath: string) {
        this._logger.info(`[UploadWorkerDocumentUseCase] Uploading document for user: ${userId}`);

        const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);
        const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);

        let repo = workerRepo;
        let user = await workerRepo.findById(userId);

        if (!user) {
            user = await clientRepo.findById(userId);
            repo = clientRepo;
        }

        if (!user) throw new Error("User not found");

        // Upload to Cloudinary
        const url = await CloudinaryUploadService.upload(filePath, "users/documents");

        // Always append
        user.documents = user.documents || [];
        user.documents.push(url);

        await repo.updateById(userId, user);

        return { url };
    }
}

