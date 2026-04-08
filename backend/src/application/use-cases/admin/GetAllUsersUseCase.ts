import { IGetAllUsersUseCase } from "../../interfaces/admin/IGetAllUsersUseCase";
import { Role } from "../../../shared/enums/authEnums";
import { UserMapper } from "../../mappers/UserMapper";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { ILogger } from "../../../infrastructure/logger/ILogger";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { ListUsersQuery } from "../../../shared/queries/ListUsersQuery";

import { S3Service } from "../../../infrastructure/adapters/S3service";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(
        private readonly _repoFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger,
        private readonly _s3Service: S3Service
    ) { }

    async execute(query: ListUsersQuery): Promise<{ users: UserResponseDTO[]; total: number; totalPages: number }> {
        this._logger.info("Fetching users with filters");

        const {
            isBlocked,
            isVerified,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
            page = 1,
            limit = 20,
        } = query;

        const userRepo = this._repoFactory.getRepository("USER" as any);

        const filter = {
            isBlocked,
            isVerified,
            search,
            role: { $ne: Role.ADMIN }
        };
        const options = { sortBy, sortOrder, page, limit };

        const result = await userRepo.findWithPagination(filter, options);

        const usersWithSignedUrls = await Promise.all(result.users.map(async (user) => {
            if (user.profilePictureUrl) {
                user.profilePictureUrl = await this._signUrl(user.profilePictureUrl);
            }

            if (user.documents && user.documents.length > 0) {
                user.documents = await Promise.all(user.documents.map(async (doc) => this._signUrl(doc)));
            }

            if (user.certificates && user.certificates.length > 0) {
                user.certificates = await Promise.all(user.certificates.map(async (cert) => this._signUrl(cert)));
            }

            if (user.workPhotos && user.workPhotos.length > 0) {
                user.workPhotos = await Promise.all(user.workPhotos.map(async (photo) => this._signUrl(photo)));
            }

            return UserMapper.toResponseDTO(user);
        }));


        return {
            users: usersWithSignedUrls,
            total: result.total,
            totalPages: result.totalPages
        };
    }

    private async _signUrl(urlOrKey: string): Promise<string> {
        if (!urlOrKey) return urlOrKey;

        // If it's an S3 URL, extract the key and sign it
        if (urlOrKey.includes("amazonaws.com")) {
            const parts = urlOrKey.split(".com/");
            if (parts.length > 1) {
                const key = parts[1];
                return this._s3Service.getPresignedDownloadUrl(decodeURIComponent(key));
            }
        }

        // If it's a key (not http), sign it
        if (!urlOrKey.startsWith("http")) {
            return this._s3Service.getPresignedDownloadUrl(urlOrKey);
        }

        return urlOrKey;
    }
}
