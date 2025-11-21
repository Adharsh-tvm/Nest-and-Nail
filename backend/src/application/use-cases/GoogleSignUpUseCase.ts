import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginMethod, Role } from "../../shared/enums/enums";
import { IGoogleSignUpUseCase } from "../interfaces/IGoogleSignUpUseCase"; 
import { IGoogleAuthService } from "../services/IGoogleAuthService";
import { ITokenService } from "../services/ITokenService";

export class GoogleSignUpUseCase implements IGoogleSignUpUseCase {
    constructor(
        private userRepositoryFactory: IUserRepository,
        private tokenService: ITokenService,
        private googleAuthService: IGoogleAuthService
    ) { }

    async execute(
        accessToken: string, 
        role?: Role,
        mode: "signup" | "login" = "signup"
    ) {
        console.log("[GoogleSignUpUseCase] Starting execution with:", { role, mode });

        // Get user info from Google
        const googleUser = await this.googleAuthService.getUserFromAccessToken(accessToken);
        
        console.log("[GoogleSignUpUseCase] Google user info:", googleUser.email);

        // For login mode, check if user exists in either repository
        if (mode === "login") {
            // Try to find user as client first
            let clientRepo = this.userRepositoryFactory.getRepository(Role.CLIENT);
            let user = await clientRepo.findByEmail(googleUser.email);
            
            if (user) {
                // User exists as client
                const accessToken = this.tokenService.generateAccessToken({
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
                    accessToken,
                    refreshToken
                };
            }

            // Try to find user as worker
            let workerRepo = this.userRepositoryFactory.getRepository(Role.WORKER);
            user = await workerRepo.findByEmail(googleUser.email);
            
            if (user) {
                // User exists as worker
                const accessToken = this.tokenService.generateAccessToken({
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
                    accessToken,
                    refreshToken
                };
            }

            // User doesn't exist
            throw new Error("No account found with this Google email. Please sign up first.");
        }

        // Signup mode - role must be provided
        if (!role) {
            throw new Error("Role is required for signup");
        }

        // Get the repository for the specified role
        const repo = this.userRepositoryFactory.getRepository(role);

        // Check if user already exists WITH THIS SPECIFIC ROLE
        let user = await repo.findByEmail(googleUser.email);

        if (user) {
            // User already exists with this exact role
            if (user.loginMethod === LoginMethod.EMAIL_PASSWORD) {
                throw new Error("An account with this email already exists. Please sign in with email and password.");
            }
            
            // User exists with Google login and same role - just log them in
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

        // Check if user exists with a DIFFERENT role
        const otherRole = role === Role.CLIENT ? Role.WORKER : Role.CLIENT;
        const otherRepo = this.userRepositoryFactory.getRepository(otherRole);
        const existingUserWithOtherRole = await otherRepo.findByEmail(googleUser.email);

        if (existingUserWithOtherRole) {
            throw new Error(`An account with this email already exists as a ${otherRole.toLowerCase()}. Please use the login page instead.`);
        }

        // Create new user with the specified role
        user = await repo.create({
            userId: crypto.randomUUID(),
            name: googleUser.name,
            email: googleUser.email,
            profilePictureUrl: googleUser.picture,
            role,
            loginMethod: LoginMethod.GOOGLE,
            passwordhash: null,
            lastLoginAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any);

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