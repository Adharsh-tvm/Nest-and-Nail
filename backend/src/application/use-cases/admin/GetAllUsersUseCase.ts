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

    async execute(query: ListUsersQuery): Promise<UserResponseDTO[]> {
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

        const clientRepo = this._repoFactory.getRepository(Role.CLIENT);
        const workerRepo = this._repoFactory.getRepository(Role.WORKER);

        const filter = { isBlocked, isVerified, search };
        const options = { sortBy, sortOrder, page, limit };

        const [clients, workers] = await Promise.all([
            clientRepo.findWithQuery(filter, options),
            workerRepo.findWithQuery(filter, options),
        ]);

        return [...clients, ...workers].map(UserMapper.toResponseDTO);
    }

}
