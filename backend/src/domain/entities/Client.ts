import { Role } from "../../shared/enums/enums";
import { User } from "./User";

export interface Client extends User {
    role: Role.CLIENT;
    address?: string;
}

