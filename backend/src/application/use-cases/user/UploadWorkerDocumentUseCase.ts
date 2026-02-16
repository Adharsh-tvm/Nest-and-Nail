import { ILogger } from "../../../infrastructure/logger/ILogger";
import { Role, VerificationStatus } from "../../../shared/enums/authEnums";
import { IUploadWorkerDocumentUseCase } from "../../interfaces/user/IUploadWorkerDocumentUseCase";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { S3Service } from "../../../infrastructure/adapters/S3service";

export class UploadWorkerDocumentUseCase implements IUploadWorkerDocumentUseCase {
    constructor(
        private readonly _repositoryFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger,
        private readonly _s3Service: S3Service
    ) { }

    async execute(userId: string, filePath: string, mimetype: string) {
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

        const key = `users/documents/${userId}-${Date.now()}`;
        const url = await this._s3Service.uploadFile(filePath, key, mimetype);

        user.documents = user.documents || [];
        user.documents.push(url);

        user.isVerified = VerificationStatus.PENDING;

        await repo.updateById(userId, user);

        return { url };
    }
}
