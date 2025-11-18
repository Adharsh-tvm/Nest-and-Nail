import { Role } from "../../shared/enums/enums";

export interface IGoogleLoginUseCase {
    execute(idToken: string, role: Role): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
}
