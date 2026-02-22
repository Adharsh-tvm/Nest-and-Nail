import { User } from "../../../../domain/entities/User";

export interface IUpdateWorkerCategoriesUseCase {
    execute(userId: string, categoryIds: string[]): Promise<User>;
}
