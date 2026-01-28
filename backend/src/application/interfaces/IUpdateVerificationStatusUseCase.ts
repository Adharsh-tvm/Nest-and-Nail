import { VerificationStatus } from "../../shared/enums/authEnums";
import { UserResponseDTO } from "../dtos/UserDTO";

export interface IUpdateVerificationStatusUseCase {
    execute(userId: string, status: VerificationStatus, reason?: string): Promise<UserResponseDTO>;
}
