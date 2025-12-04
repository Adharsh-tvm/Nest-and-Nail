import { LoginMethod, Role } from "../../shared/enums/enums";

export interface User {
    userId: string,
    name: string,
    email: string,
    phone?: number,
    passwordhash: string,
    isBlocked?: boolean,
    isVerfied?:boolean,
    profilePictureUrl?: string,
    role: Role,
    loginMethod: LoginMethod,
    lastLoginAt: Date,
    createdAt: Date,
    updatedAt: Date,

     skills?: string[];
    address?: string;
}