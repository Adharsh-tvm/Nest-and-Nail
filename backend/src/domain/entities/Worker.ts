import { Role } from "../../shared/enums/authEnums";
import { User } from "./User";
import { Review } from "./Review";

export interface Worker extends User {
    role: Role.WORKER;
    reviews?: Review[];
}