import { Role } from "../../shared/enums/authEnums";
import { User } from "./User";

export interface Worker extends User {
    role: Role.WORKER;


} 