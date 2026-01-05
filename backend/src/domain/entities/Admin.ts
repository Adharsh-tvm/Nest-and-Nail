import { Role } from "../../shared/enums/authEnums";
import { User } from "./User";

export interface Admin extends User {
    role: Role.ADMIN;
}

