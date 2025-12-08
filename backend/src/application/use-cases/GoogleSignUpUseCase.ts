import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginMethod, Role } from "../../domain/enums/enums";
import { IGoogleSignUpUseCase } from "../interfaces/IGoogleSignUpUseCase";
import { UserMapper } from "../mappers/UserMapper";
import { IGenerateUserID } from "../services/IGenerateUserID";
import { IGoogleAuthService } from "../services/IGoogleAuthService";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { ITokenService } from "../services/ITokenService";

export class GoogleSignUpUseCase implements IGoogleSignUpUseCase {
    constructor(
        private readonly _userRepositoryFactory: IUserRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _tokenService: ITokenService,
        private readonly _googleAuthService: IGoogleAuthService,
        private readonly _userIdGenerator: IGenerateUserID,
    ) { }

    async execute(
        email: string,
        name: string,
        role: string
    ) {
        try {
            let user: User | null = null
            const clientRepository = this._userRepositoryFactory.getRepository(Role.CLIENT)
            const workerRepository = this._userRepositoryFactory.getRepository(Role.WORKER)

            user = await clientRepository.findByEmail(email)
            if (!user) {
                user = await workerRepository.findByEmail(email)
            }

            if (!user) {
                //register a new user based on role.
                const repository = this._userRepositoryFactory.getRepository(role as Role);
                const hashedPassword = await this._passwordHasher.hash("11111111");
                const userId = await this._userIdGenerator.create();
                const newUser = await repository.create({
                    userId: userId,
                    name: name,
                    email: email,
                    passwordhash: hashedPassword,
                    role: role as Role,
                    isBlocked: false,
                    loginMethod: LoginMethod.GOOGLE,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lastLoginAt: new Date(),
                });
                user = newUser
            }


            const userResponse = UserMapper.toResponseDTO(user);
            const accessToken = this._tokenService.generateAccessToken({
                id: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            });
            const refreshToken = this._tokenService.generateRefreshToken({
                id: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            });



            return {
                user: userResponse,
                accessToken,
                refreshToken
            }


        } catch (error) {
            console.log("Reg GOog Use case error: ", error)
            return {
                user: null,
                accessToken: "",
                refreshToken: ""
            }
        }
    }
}