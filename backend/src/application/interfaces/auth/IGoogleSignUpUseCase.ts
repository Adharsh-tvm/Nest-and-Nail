import { Role } from "../../../shared/enums/authEnums";
import { LoginResponseDTO } from "../../dtos/UserDTO";

export interface IGoogleSignUpUseCase {
    execute(
        email: string,
        name: string,
        role: string
    ): Promise<LoginResponseDTO>;
}