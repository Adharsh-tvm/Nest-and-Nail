import { Role } from "../../shared/enums/authEnums";

export interface IGoogleSignUpUseCase {
    execute(
        email: string,
        name: string,
        role: string
    ): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
}