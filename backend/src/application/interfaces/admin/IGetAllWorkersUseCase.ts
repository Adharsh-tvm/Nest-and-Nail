import { UserResponseDTO } from "../../dtos/UserDTO";

export interface IGetAllWorkersUseCase {
    execute(): Promise<UserResponseDTO[]>;
}