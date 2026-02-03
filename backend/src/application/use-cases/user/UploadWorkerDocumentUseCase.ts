import { ILogger } from "../../../infrastructure/logger/ILogger";
import { Role, VerificationStatus } from "../../../shared/enums/authEnums";
import { CloudinaryUploadService } from "../../../infrastructure/adapters/CloudinaryUploadService";
import { IUploadWorkerDocumentUseCase } from "../../interfaces/user/IUploadWorkerDocumentUseCase";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";

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

        const url = await CloudinaryUploadService.upload(filePath, "users/documents");

        user.documents = user.documents || [];
        user.documents.push(url);

        user.isVerified = VerificationStatus.PENDING;

        await repo.updateById(userId, user);

        return { url };
    }
}
