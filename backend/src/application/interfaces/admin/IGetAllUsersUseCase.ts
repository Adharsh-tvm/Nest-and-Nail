import { ListUsersQuery } from "../../../shared/queries/ListUsersQuery";
import { UserResponseDTO } from "../../dtos/UserDTO";

export interface IGetAllUsersUseCase {
    execute(query: ListUsersQuery): Promise<{ users: UserResponseDTO[]; total: number; totalPages: number }>;
}
