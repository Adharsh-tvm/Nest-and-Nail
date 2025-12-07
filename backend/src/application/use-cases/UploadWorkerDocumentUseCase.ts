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

        // STEP 1 — Try all repositories
        let user =
            (await this._repositoryFactory.getRepository(Role.WORKER).findById(userId)) ||
            (await this._repositoryFactory.getRepository(Role.CLIENT).findById(userId));

        if (!user) throw new Error("User not found");

        // STEP 2 — Upload to Cloudinary
        const url = await CloudinaryUploadService.upload(filePath, "workers/documents");

        // STEP 3 — Convert CLIENT → WORKER if needed
        if (user.role !== Role.WORKER) {
            this._logger.info(`[UploadWorkerDocumentUseCase] User was CLIENT → converting to WORKER`);

            user.role = Role.WORKER;
            user.documents = [];
        }

        // STEP 4 — Add document
        user.documents = user.documents || [];
        user.documents.push(url);

        // STEP 5 — Save using worker repository
        const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);
        await workerRepo.updateById(userId, user);

        return { url };
    }
}
