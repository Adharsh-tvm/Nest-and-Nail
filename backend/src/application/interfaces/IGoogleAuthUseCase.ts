import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";

export interface IGoogleAuthUseCase {
    execute(userData: UserRequestDTO): Promise<{
        user: UserResponseDTO;
        accessToken: string;
        refreshToken: string;
    }>;
}