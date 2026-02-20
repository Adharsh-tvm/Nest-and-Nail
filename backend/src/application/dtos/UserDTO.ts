import { Role, VerificationStatus } from "../../shared/enums/authEnums";
import { AddressDTO } from "./AddressDTO";

export interface UserRequestDTO {
    user_name: string;
    email_address: string;
    password: string;
    phone_number?: number;
    user_role: Role
}

export interface UserResponseDTO {
    user_id: string;
    user_name: string;
    email_address: string;
    phone_number?: number;
    user_role: Role;
    profileImageUrl?: string;
    isBlocked: boolean;
    isOnline: boolean;
    isVerified: VerificationStatus;

    skills?: string[];
    address?: AddressDTO[];
    documents?: string[];
    certificates?: string[];
    categories?: string[];
    workPhotos?: string[];
    createdAt?: string;
    updatedAt?: string;
    rating?: number;
    totalRatings?: number;
    totalCompletedJobs?: number;
    currentActiveRequestId?: string;
}


export interface LoginUserDTO {
    email_address: string;
    password: string;
    user_role?: Role;
}

export interface LoginResponseDTO {
    user: {
        user_id: string;
        user_name: string;
        email_address: string;
        user_role: Role;
        phone_number?: number;
        profileImageUrl?: string | undefined;
        isBlocked: boolean;
        isOnline: boolean;
        isVerified: VerificationStatus;
        categories?: string[];
        rating?: number;
        totalRatings?: number;
        totalCompletedJobs?: number;
        currentActiveRequestId?: string;
    };
    accessToken: string;
    refreshToken: string;
}

