import { Role } from "../../shared/enums/enums";
import { UserResponseDTO } from "../dtos/UserDTO";

export interface IChangeUserRoleUseCase {
    execute(userId: string, newRole: Role): Promise<UserResponseDTO>;
}