import { Role } from "../enums/enums";
import { IBaseRepository } from "../repositories/IBaseRepository";
import { User } from "../entities/User";

export interface IUserRepositoryFactory {
    getRepository<T extends User>(role: Role): IBaseRepository<T>;
}
