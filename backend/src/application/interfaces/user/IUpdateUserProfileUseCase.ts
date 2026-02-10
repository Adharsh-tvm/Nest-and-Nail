import { User } from "../../../domain/entities/User";
import { UserResponseDTO } from "../../dtos/UserDTO";


export interface IUpdateUserProfileUseCase {
    execute(userId: string, updates: Partial<User>, profilePictureFilePath?: string): Promise<UserResponseDTO>;
}
