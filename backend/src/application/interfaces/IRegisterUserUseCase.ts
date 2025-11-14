import { UserRequestDTO, UserResponseDTO } from "../dtos/UserDTO";

export interface IRegisterUserUseCase {
    execute(userData: UserRequestDTO): Promise<{
        user: UserResponseDTO;
        accessToken: string;
        refreshToken: string;
    }>;
}