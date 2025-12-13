import { User } from "../../domain/entities/User";
import { LoginMethod, VerificationStatus } from "../../domain/enums/enums";
import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";

export class UserMapper {
    static toDomain(userData: UserRequestDTO, hashedPassword: string, userId: string): User {
        return {
            userId,
            name: userData.user_name,
            email: userData.email_address,
            passwordhash: hashedPassword,
            phone: userData.phone_number,
            role: userData.user_role,
            isBlocked: false,
            isVerified: VerificationStatus.NOT_VERIFIED,
            loginMethod: LoginMethod.EMAIL_PASSWORD,
            profilePictureUrl: '',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            updatedAt: new Date()
        };
    }

    static toResponseDTO(userData: User): UserResponseDTO {
        return {
            user_id: userData.userId,
            user_name: userData.name,
            email_address: userData.email,
            phone_number: userData.phone,
            user_role: userData.role,
            profileImageUrl: userData.profilePictureUrl,
            isBlocked: userData.isBlocked ?? false,
            isVerified: userData.isVerified ?? VerificationStatus.NOT_VERIFIED,

            skills: userData.skills ?? [],
            address: userData.address ?? "",

            documents: userData.documents ?? [],
            certificates: userData.certificates ?? [],
            workPhotos: userData.workPhotos ?? [],

            createdAt: userData.createdAt?.toISOString?.() ?? "",
            updatedAt: userData.updatedAt?.toISOString?.() ?? "",
        };
    }




}