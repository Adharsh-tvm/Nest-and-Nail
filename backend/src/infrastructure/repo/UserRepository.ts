import { User } from "../../domain/entities/User";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { UserModel } from "../database/models/UserModel";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> implements IBaseRepository<User> {
    constructor() {
        super(UserModel);
    }
}
