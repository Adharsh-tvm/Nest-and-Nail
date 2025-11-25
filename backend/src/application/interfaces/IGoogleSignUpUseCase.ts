import { Role } from "../../shared/enums/enums";

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