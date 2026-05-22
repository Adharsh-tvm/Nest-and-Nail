import { UserResponseDTO } from "../../dtos/UserDTO";

export interface IGetAllClientsUseCase {
    execute(): Promise<UserResponseDTO[]>;
}