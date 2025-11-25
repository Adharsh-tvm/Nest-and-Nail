import { User } from "../entities/User";
import { IBaseRepository } from "./IBaseRepository";
import { Role } from "../../shared/enums/enums";

export interface IUserRepository {
    getRepository<T extends User>(role: Role): IBaseRepository<T>;
}