import { UserResponseDTO } from "../dtos/UserDTO";

export interface IGetAllUsersUseCase {
    execute(): Promise<UserResponseDTO[]>;
}
