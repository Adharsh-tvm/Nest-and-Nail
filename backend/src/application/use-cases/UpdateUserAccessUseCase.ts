import { UserMapper } from "../mappers/UserMapper";
import { ILogger } from "../interfaces/ILogger";
import { Role } from "../../shared/enums/authEnums";
import { IUpdateUserAccessUseCase } from "../interfaces/IUpdateUserAccessUseCase";
import { IUserRepositoryFactory } from "../../domain/repositories/IUserRepositoryFactory";

export class UpdateUserAccessUseCase implements IUpdateUserAccessUseCase {
    constructor(
        private readonly _repoFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger
    ) { }

    async execute(userId: string) {
        this._logger.info(`Updating verification status for user ${userId} `);

        const clientRepo = this._repoFactory.getRepository(Role.CLIENT);
        const workerRepo = this._repoFactory.getRepository(Role.WORKER);

        let user = await clientRepo.findById(userId);
        if (!user) user = await workerRepo.findById(userId);

        if (!user) throw new Error("User not found");

        const repo = user.role === Role.WORKER ? workerRepo : clientRepo;

        const newIsBlocked = !user.isBlocked;

        this._logger.info(
            `User ${userId} access changed: isBlocked → ${newIsBlocked}`
        );

        const updated = await repo.updateById(userId, { isBlocked: newIsBlocked });;

        if (!updated) throw new Error("Failed to update verification status");

        return UserMapper.toResponseDTO(updated);
    }
}
