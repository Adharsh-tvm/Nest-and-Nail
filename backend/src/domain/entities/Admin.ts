import { Role } from "../enums/enums";
import { User } from "./User";

export interface Admin extends User {
    role: Role.ADMIN;
}

