import { IWorkerRepository } from "../../../domain/repositories/IWorkerRepository";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { IGetAllWorkersUseCase } from "../../interfaces/admin/IGetAllWorkersUseCase";
import { UserMapper } from "../../mappers/UserMapper";

import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetAllWorkersUseCase implements IGetAllWorkersUseCase {
    constructor(
        private readonly _workerRepoository: IWorkerRepository,
        private readonly _s3Service: S3Service
    ) { };

    async execute(): Promise<UserResponseDTO[]> {
        const workers = await this._workerRepoository.findAll();

        const workersWithSignedUrls = await Promise.all(workers.map(async (worker) => {
            if (worker.profilePictureUrl) {
                worker.profilePictureUrl = await this._signUrl(worker.profilePictureUrl);
            }

            if (worker.documents && worker.documents.length > 0) {
                worker.documents = await Promise.all(worker.documents.map(async (doc) => this._signUrl(doc)));
            }

            if (worker.certificates && worker.certificates.length > 0) {
                worker.certificates = await Promise.all(worker.certificates.map(async (cert) => this._signUrl(cert)));
            }

            if (worker.workPhotos && worker.workPhotos.length > 0) {
                worker.workPhotos = await Promise.all(worker.workPhotos.map(async (photo) => this._signUrl(photo)));
            }

            return UserMapper.toResponseDTO(worker);
        }));

        return workersWithSignedUrls;
    }

    private async _signUrl(urlOrKey: string): Promise<string> {
        if (!urlOrKey) return urlOrKey;

        if (urlOrKey.includes("amazonaws.com")) {
            const parts = urlOrKey.split(".com/");
            if (parts.length > 1) {
                const key = parts[1];
                return this._s3Service.getPresignedDownloadUrl(decodeURIComponent(key));
            }
        }

        if (!urlOrKey.startsWith("http")) {
            return this._s3Service.getPresignedDownloadUrl(urlOrKey);
        }

        return urlOrKey;
    }
}