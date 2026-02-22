import { UserResponseDTO } from "../../dtos/UserDTO";

export interface IUpdateUserAccessUseCase {
    execute(userId: string): Promise<UserResponseDTO>;
}
