import { VerificationStatus } from "../../domain/enums/enums";
import { UserResponseDTO } from "../dtos/UserDTO";

export interface IUpdateVerificationStatusUseCase {
    execute(userId: string, status: VerificationStatus): Promise<UserResponseDTO>;
}
