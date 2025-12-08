import { Role } from "../../domain/enums/enums";
import { UserResponseDTO } from "../dtos/UserDTO";

export interface IChangeUserRoleUseCase {
    execute(userId: string, newRole: Role): Promise<{
        user: UserResponseDTO;
        accessToken: string;
        refreshToken: string;
    }>;
}
