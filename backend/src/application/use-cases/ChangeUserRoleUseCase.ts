import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { Role } from "../../shared/enums/enums";
import { UserResponseDTO } from "../dtos/UserDTO";
import { IChangeUserRoleUseCase } from "../interfaces/IChangeUserRoleUseCase";
import { ILogger } from "../interfaces/ILogger";
import { UserMapper } from "../mappers/UserMapper";

export class ChangeUserRoleUseCase implements IChangeUserRoleUseCase {
    constructor(
        private readonly _repositoryFactory: UserRepositoryFactory,
        private readonly _logger: ILogger
    ) { }

    async execute(userId: string, newRole: Role): Promise<UserResponseDTO> {
        this._logger.info(`[ChangeUserRoleUseCase] User ${userId} switching to ${newRole}`);

        const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);
        const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);

        // Check both collections
        let user = await clientRepo.findById(userId);
        let currentRole: Role | null = user ? Role.CLIENT : null;

        if (!user) {
            user = await workerRepo.findById(userId);
            currentRole = user ? Role.WORKER : null;
        }

        if (!user) throw new Error("User not found");

        // Return early if same role
        if (currentRole === newRole) {
            return UserMapper.toResponseDTO(user);
        }

        // Convert user safely
        const rawUser = user as any;

        if (newRole === Role.WORKER) {
            // 1. delete from client
            await clientRepo.deleteByUserId(userId);

            // 2. create worker
            const workerData: any = {
                ...rawUser,
                role: Role.WORKER,
                skills: rawUser.skills ?? [],
                isVerfied: rawUser.isVerfied ?? false,
            };

            const created = await workerRepo.create(workerData);
            return UserMapper.toResponseDTO(created);
        }

        if (newRole === Role.CLIENT) {
            // 1. delete from worker
            await workerRepo.deleteByUserId(userId);

            // 2. create client
            const clientData: any = {
                ...rawUser,
                role: Role.CLIENT,
            };

            // Remove worker-only fields
            delete clientData.skills;
            delete clientData.isVerfied;

            const created = await clientRepo.create(clientData);
            return UserMapper.toResponseDTO(created);
        }

        throw new Error("Invalid role switch");
    }


}