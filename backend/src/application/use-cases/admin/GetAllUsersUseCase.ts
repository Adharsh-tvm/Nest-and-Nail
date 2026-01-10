import { IGetAllUsersUseCase } from "../../interfaces/IGetAllUsersUseCase";
import { Role } from "../../../shared/enums/authEnums";
import { UserMapper } from "../../mappers/UserMapper";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { ILogger } from "../../interfaces/ILogger";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(
        private readonly _repoFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger
    ) { }

    async execute(): Promise<UserResponseDTO[]> {
        this._logger.info("Fetching ALL users (admin + workers + clients)");

        const clientRepo = this._repoFactory.getRepository(Role.CLIENT);
        const workerRepo = this._repoFactory.getRepository(Role.WORKER);

        const [clients, workers] = await Promise.all([
            clientRepo.findAll(),
            workerRepo.findAll(),
        ]);

        const allUsers = [...clients, ...workers];

        return allUsers.map(user => UserMapper.toResponseDTO(user));
    }
}
