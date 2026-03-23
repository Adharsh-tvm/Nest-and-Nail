import { User } from "../../domain/entities/User";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { UserModel, IUserDocument } from "../database/models/UserModel";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User, IUserDocument> implements IBaseRepository<User> {
    constructor() {
        super(UserModel);
    }
}
