import { IGetAllUsersUseCase } from "../interfaces/IGetAllUsersUseCase";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { Role } from "../../domain/enums/enums";
import { UserMapper } from "../mappers/UserMapper";
import { UserResponseDTO } from "../dtos/UserDTO";
import { ILogger } from "../interfaces/ILogger";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(
        private readonly repoFactory: UserRepositoryFactory,
        private readonly logger: ILogger
    ) { }

    async execute(): Promise<UserResponseDTO[]> {
        this.logger.info("Fetching ALL users (admin + workers + clients)");

        const clientRepo = this.repoFactory.getRepository(Role.CLIENT);
        const workerRepo = this.repoFactory.getRepository(Role.WORKER);

        const [clients, workers] = await Promise.all([
            clientRepo.findAll(),
            workerRepo.findAll(),
        ]);

        const allUsers = [...clients, ...workers];

        return allUsers.map(user => UserMapper.toResponseDTO(user));
    }
}
