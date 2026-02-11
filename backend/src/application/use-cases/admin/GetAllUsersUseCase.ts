import { IGetAllUsersUseCase } from "../../interfaces/admin/IGetAllUsersUseCase";
import { Role } from "../../../shared/enums/authEnums";
import { UserMapper } from "../../mappers/UserMapper";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { ILogger } from "../../../infrastructure/logger/ILogger";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { ListUsersQuery } from "../../../shared/queries/ListUsersQuery";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(
        private readonly _repoFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger
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

        return {
            users: result.users.map(UserMapper.toResponseDTO),
            total: result.total,
            totalPages: result.totalPages
        };
    }

}
