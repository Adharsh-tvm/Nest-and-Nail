import { Role } from "../../../shared/enums/authEnums";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { IChangeUserRoleUseCase } from "../../interfaces/user/IChangeUserRoleUseCase";
import { ILogger } from "../../../infrastructure/logger/ILogger";
import { UserMapper } from "../../mappers/UserMapper";
import { ITokenService } from "../../contracts/ITokenService";
import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";

export class ChangeUserRoleUseCase implements IChangeUserRoleUseCase {
    constructor(
        private readonly _repositoryFactory: IUserRepositoryFactory,
        private readonly _logger: ILogger,
        private readonly _tokenService: ITokenService
    ) { }

    async execute(userId: string, newRole: Role): Promise<{
        user: UserResponseDTO;
        accessToken: string;
        refreshToken: string;
    }> {
        this._logger.info(`[ChangeUserRoleUseCase] User ${userId} switching to ${newRole}`);


        const clientRepo = this._repositoryFactory.getRepository(Role.CLIENT);
        const workerRepo = this._repositoryFactory.getRepository(Role.WORKER);

        let user = await clientRepo.findById(userId);
        let currentRole: Role | null = user ? Role.CLIENT : null;

        if (!user) {
            user = await workerRepo.findById(userId);
            currentRole = user ? Role.WORKER : null;
        }

        if (!user) throw new Error("User not found");

        const raw = user as any;

        if (currentRole === newRole) {
            const response = UserMapper.toResponseDTO(user);

            return {
                user: response,
                accessToken: this._tokenService.generateAccessToken({
                    id: user.userId,
                    name: user.name,
                    email: user.email,
                    role: newRole
                }),
                refreshToken: this._tokenService.generateRefreshToken({
                    id: user.userId,
                    name: user.name,
                    email: user.email,
                    role: newRole
                })
            };
        }

        let newUser: any;

        if (newRole === Role.WORKER) {
            await clientRepo.deleteByUserId(userId);

            const workerData = {
                ...raw,
                role: Role.WORKER,
                skills: raw.skills ?? [],
            };

            newUser = await workerRepo.create(workerData);
        }

        if (newRole === Role.CLIENT) {
            await workerRepo.deleteByUserId(userId);

            const clientData = {
                ...raw,
                role: Role.CLIENT
            };

            delete clientData.skills;

            newUser = await clientRepo.create(clientData);
        }

        const userDto = UserMapper.toResponseDTO(newUser);

        return {
            user: userDto,
            accessToken: this._tokenService.generateAccessToken({
                id: newUser.userId,
                name: newUser.name,
                email: newUser.email,
                role: newRole
            }),
            refreshToken: this._tokenService.generateRefreshToken({
                id: newUser.userId,
                name: newUser.name,
                email: newUser.email,
                role: newRole
            })
        };
    }



}