import { Admin } from "../../domain/entities/Admin";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { AdminModel } from "../database/models/AdminModel";
import { BaseRepository } from "./BaseRepository";

export class AdminRepository extends BaseRepository<Admin> implements IAdminRepository {
    constructor() {
        super(AdminModel);
    }
}