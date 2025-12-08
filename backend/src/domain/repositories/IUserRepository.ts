import { User } from "../entities/User";
import { IBaseRepository } from "./IBaseRepository";
import { Role } from "../enums/enums";

export interface IUserRepository {
    getRepository<T extends User>(role: Role): IBaseRepository<T>;
}