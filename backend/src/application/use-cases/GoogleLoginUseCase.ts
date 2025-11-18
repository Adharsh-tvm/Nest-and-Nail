import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginMethod, Role } from "../../shared/enums/enums";
import { IGoogleLoginUseCase } from "../interfaces/IGoogleLoginUseCase";
import { IGoogleAuthService } from "../services/IGoogleAuthService";
import { ITokenService } from "../services/ITokenService";

export class GoogleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        private userRepositoryFactory: IUserRepository,
        private tokenService: ITokenService,
        private googleAuthService: IGoogleAuthService
    ) { }

    async execute(accessToken: string, role: Role) {

        const googleUser = await this.googleAuthService.getUserFromAccessToken(accessToken);

        const repo = this.userRepositoryFactory.getRepository(role);

        let user = await repo.findByEmail(googleUser.email);

        if (!user) {
            user = await repo.create({
                userId: crypto.randomUUID(),
                name: googleUser.name,
                email: googleUser.email,
                avatar: googleUser.picture,
                role,
                loginMethod: LoginMethod.GOOGLE,
                passwordhash: null,
            } as any);
        }

        const newAccessToken = this.tokenService.generateAccessToken({
            id: user.userId,
            email: user.email,
            role: user.role,
        });

        const refreshToken = this.tokenService.generateRefreshToken({
            id: user.userId,
            email: user.email,
            role: user.role,
        });

        return {
            user,
            accessToken: newAccessToken,
            refreshToken
        };
    }

}