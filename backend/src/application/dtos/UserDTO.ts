import { Role, VerificationStatus } from "../../domain/enums/enums";

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
    isVerified: VerificationStatus;

    skills?: string[];
    address?: string;
    documents?: string[];
    certificates?: string[];
    workPhotos?: string[];
    createdAt?: string;
    updatedAt?: string;
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
        isVerified: VerificationStatus;
    };
    accessToken: string;
    refreshToken: string;
}