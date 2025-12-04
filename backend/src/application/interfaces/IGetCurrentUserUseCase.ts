import { UserResponseDTO } from "../dtos/UserDTO";

export interface IGetCurrentUserUseCase {
    execute(email: string): Promise<UserResponseDTO | null>;
}

