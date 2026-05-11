import { User } from "../../domain/entities/User";
import { LoginMethod, VerificationStatus } from "../../shared/enums/authEnums";
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
            isOnline: true,
            loginMethod: LoginMethod.EMAIL_PASSWORD,
            profilePictureUrl: '',
            rating: 0,
            totalRatings: 0,
            weeklyJobCount: 0,
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
            isOnline: userData.isOnline,
            isVerified: userData.isVerified ?? VerificationStatus.NOT_VERIFIED,

            skills: userData.skills ?? [],
            address: userData.address?.map(addr => ({
                addressId: addr.addressId,
                label: addr.label,
                street: addr.street,
                city: addr.city,
                state: addr.state,
                country: addr.country,
                zip: addr.zip,
                lat: addr.location.coordinates[1],
                lng: addr.location.coordinates[0],
                isDefault: addr.isDefault,
            })) ?? [],


            documents: userData.documents ?? [],
            certificates: userData.certificates ?? [],
            categories: userData.categories ?? [],
            workPhotos: userData.workPhotos ?? [],

            rating: userData.rating ?? 0,
            totalRatings: userData.totalRatings ?? 0,
            weeklyJobCount: userData.weeklyJobCount ?? 0,
            currentActiveRequestId: userData.currentActiveRequestId ?? undefined,
            isSuspended: userData.isSuspended ?? false,
            suspensionStartDate: userData.suspensionStartDate ? userData.suspensionStartDate.toISOString() : undefined,
            suspensionEndDate: userData.suspensionEndDate ? userData.suspensionEndDate.toISOString() : undefined,
            canAcceptBookings: userData.canAcceptBookings ?? true,

            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
        };
    }
}