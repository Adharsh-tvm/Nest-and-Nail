import { Client } from "../../domain/entities/Client";
import { LoginMethod } from "../../shared/enums/enums";
import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";

export class UserMapper {
    static toDomain(userData: UserRequestDTO, hashedPassword: string, clientId: string): Client {
        return {
            clientId,
            name: userData.user_name,
            email: userData.email_address,
            passwordhash: hashedPassword,
            phone: userData.phone_number,
            role: userData.user_role,
            isBlocked: false,
            loginMethod: LoginMethod.EMAIL_PASSWORD,
            profilePictureUrl: '',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            updatedAt: new Date(0)
        }
    }
    static toResponseDTO(clientData: Client): UserResponseDTO {
        return {
            user_id: clientData.clientId,
            user_name: clientData.name,
            email_address: clientData.email,
            phone_number: clientData.phone,
            user_role: clientData.role,
            profileImageUrl: clientData.profilePictureUrl,
            isBlocked: clientData.isBlocked ?? false,
        }
    }
}