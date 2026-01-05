import { LoginMethod, Role, VerificationStatus } from "../../shared/enums/authEnums";

export interface User {
    userId: string,
    name: string,
    email: string,
    phone?: number,
    passwordhash: string,
    isBlocked?: boolean,
    isVerified?: VerificationStatus,
    profilePictureUrl?: string,
    role: Role,
    loginMethod: LoginMethod,
    lastLoginAt: Date,
    createdAt: Date,
    updatedAt: Date,

    skills?: string[];
    address?: string;

    documents?: string[];      // Aadhar, PAN, ID proof
    certificates?: string[];   // Skill certificates
    workPhotos?: string[];
}