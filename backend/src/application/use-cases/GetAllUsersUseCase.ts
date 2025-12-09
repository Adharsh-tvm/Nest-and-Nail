import { IGetAllUsersUseCase } from "../interfaces/IGetAllUsersUseCase";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { Role } from "../../domain/enums/enums";
import { UserMapper } from "../mappers/UserMapper";
import { UserResponseDTO } from "../dtos/UserDTO";
import { ILogger } from "../interfaces/ILogger";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(
        private readonly _repoFactory: UserRepositoryFactory,
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

        console.log("Aaaaalllllllllllllllll", allUsers)

        return allUsers.map(user => UserMapper.toResponseDTO(user));
    }
}
