import { LoginMethod, Role, VerificationStatus } from "../../shared/enums/authEnums";
import { Address } from "./Address";

export interface User {
    userId: string;
    name: string;
    email: string;
    phone?: number;
    passwordhash: string;
    isBlocked?: boolean;
    isVerified?: VerificationStatus;
    isOnline: boolean;
    profilePictureUrl?: string;
    role: Role;
    loginMethod: LoginMethod;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;

    skills?: string[];
    address?: Address[];

    documents?: string[];
    certificates?: string[];
    categories?: string[];
    workPhotos?: string[];

    rating?: number;
    totalRatings?: number;
    isAvailable?: boolean;
    weeklyJobCount?: number;
    lastAssignedAt?: Date;
    currentActiveRequestId?: string | null;
}