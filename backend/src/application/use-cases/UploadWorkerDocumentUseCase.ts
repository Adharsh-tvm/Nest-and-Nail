import { ILogger } from "../interfaces/ILogger";
import { Role, VerificationStatus } from "../../shared/enums/authEnums";
import { CloudinaryUploadService } from "../../infrastructure/services/CloudinaryUploadService";
import { IUploadWorkerDocumentUseCase } from "../interfaces/IUploadWorkerDocumentUseCase";
import { IUserRepositoryFactory } from "../../domain/repositories/IUserRepositoryFactory";

export class UploadWorkerDocumentUseCase implements IUploadWorkerDocumentUseCase {
    constructor(
        private readonly _repositoryFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger
    ) { }

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

        // Always append documents
        user.documents = user.documents || [];
        user.documents.push(url);

        // 🔥 Mark verification status as PENDING
        user.isVerified = VerificationStatus.PENDING;

        // Save changes
        await repo.updateById(userId, user);

        return { url };
    }
}
