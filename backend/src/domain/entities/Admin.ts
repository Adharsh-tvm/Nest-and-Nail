import { Role } from "../../shared/enums/enums";
import { User } from "./User";

export interface Admin extends User {
    role: Role.ADMIN;
}

