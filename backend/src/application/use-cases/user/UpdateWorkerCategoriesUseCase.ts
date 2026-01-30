import { User } from "../../../domain/entities/User";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
import { IUpdateWorkerCategoriesUseCase } from "../../interfaces/IUpdateWorkerCategoriesUseCase";

export class UpdateWorkerCategoriesUseCase implements IUpdateWorkerCategoriesUseCase {
    constructor(
        private readonly _userRepo: IUserRepositoryFactory,
        private readonly _categoryRepo: ICategoryRepository
    ) { }

    async execute(workerId: string, categoryIds: string[]): Promise<User> {

        if (!Array.isArray(categoryIds)) {
            throw new Error("Categories must be an array");
        }
        if (categoryIds.length > 3) {
            throw new Error("Maximun 3 categories allowed");
        }

        const normalizedIds = [
            ...new Set(categoryIds.map(id => id.trim()).filter(Boolean)),
        ];


        const categories = await this._categoryRepo.findByIds(normalizedIds);

        if (categories.length !== normalizedIds.length) {
            throw new Error("One or more categories are invalid or inactive");
        }

        const workerRepo = await this._userRepo.getRepository<User>(Role.WORKER);
        const clientRepo = await this._userRepo.getRepository<User>(Role.CLIENT);

        let worker = await workerRepo.findById(workerId);
        let repo = workerRepo;

        if (!worker) {
            worker = await clientRepo.findById(workerId);
            repo = clientRepo;
        }

        if (!worker) {
            throw new Error("Worker not found");
        }

        const updated = await repo.updateById(workerId, {
            categories: normalizedIds,
        });

        if (!updated) {
            throw new Error("Failed to update categories");
        }
        return updated;
    }
}