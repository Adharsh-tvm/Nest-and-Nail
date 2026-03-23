import { Admin } from "../../domain/entities/Admin";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { AdminModel, IAdminDocument } from "../database/models/AdminModel";
import { BaseRepository } from "./BaseRepository";

export class AdminRepository extends BaseRepository<Admin, IAdminDocument> implements IAdminRepository {
    constructor() {
        super(AdminModel);
    }
}  