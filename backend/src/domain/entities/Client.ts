import { Role } from "../../shared/enums/authEnums";
import { User } from "./User";

export interface Client extends User {
    role: Role.CLIENT;
}

