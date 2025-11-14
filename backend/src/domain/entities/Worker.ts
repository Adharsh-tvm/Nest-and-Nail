import { Role } from "../../shared/enums/enums";
import { User } from "./User";

export interface Worker extends User {
    role: Role.WORKER;
    skills: string[],
} 