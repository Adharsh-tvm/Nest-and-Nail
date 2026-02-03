import { UserResponseDTO } from "../../dtos/UserDTO";

export interface IUpdateUserSkillsUseCase {
    execute(userId: string, skills: string[]): Promise<UserResponseDTO>
}