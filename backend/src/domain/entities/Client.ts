import { LoginMethod, Role } from "../../shared/enums/enums";

export interface Client {
    clientId: string,
    name: string,
    email: string,
    phone?: number,
    passwordhash: string,
    isBlocked?: boolean,
    profilePictureUrl?: string,
    role: Role,
    loginMethod: LoginMethod,
    lastLoginAt: Date,
    createdAt: Date,
    updatedAt: Date,
}

