import { IUpdateVerificationStatusUseCase } from "../interfaces/IUpdateVerificationStatusUseCase";
import { UserRepositoryFactory } from "../../infrastructure/repo/UserRepositoryFactory";
import { VerificationStatus } from "../../domain/enums/enums";
import { UserMapper } from "../mappers/UserMapper";
import { ILogger } from "../interfaces/ILogger";
import { Role } from "../../domain/enums/enums";
import { IUpdateUserAccessUseCase } from "../interfaces/IUpdateUserAccessUseCase";

export class UpdateUserAccessUseCase implements IUpdateUserAccessUseCase {
    constructor(
        private readonly repoFactory: UserRepositoryFactory,
        private readonly logger: ILogger
    ) { }

    async execute(userId: string) {
        this.logger.info(`Updating verification status for user ${userId} `);

        const clientRepo = this.repoFactory.getRepository(Role.CLIENT);
        const workerRepo = this.repoFactory.getRepository(Role.WORKER);

        let user = await clientRepo.findById(userId);
        if (!user) user = await workerRepo.findById(userId);

        if (!user) throw new Error("User not found");

        const repo = user.role === Role.WORKER ? workerRepo : clientRepo;

        const newIsBlocked = !user.isBlocked;

        this.logger.info(
            `User ${userId} access changed: isBlocked → ${newIsBlocked}`
        );

        const updated = await repo.updateById(userId, { isBlocked: newIsBlocked });;

        if (!updated) throw new Error("Failed to update verification status");

        return UserMapper.toResponseDTO(updated);
    }
}
