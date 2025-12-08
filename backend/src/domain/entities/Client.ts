import { Role } from "../enums/enums";
import { User } from "./User";

export interface Client extends User {
    role: Role.CLIENT;
}

