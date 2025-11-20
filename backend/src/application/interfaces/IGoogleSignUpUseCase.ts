import { Role } from "../../shared/enums/enums";

export interface IGoogleSignUpUseCase {
    execute(
        idToken: string, 
        role?: Role,
        mode?: "signup" | "login"
    ): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
}