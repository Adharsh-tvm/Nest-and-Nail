import { LoginUserDTO, UserResponseDTO } from "../../dtos/UserDTO";

export interface ILoginUserUseCase {
    execute(data: LoginUserDTO): Promise<{
        user: UserResponseDTO;
        accessToken: string;
        refreshToken: string;
    }>;
}