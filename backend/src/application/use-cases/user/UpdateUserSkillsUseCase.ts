import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
import { UserResponseDTO } from "../../dtos/UserDTO";
import { IUpdateUserSkillsUseCase } from "../../interfaces/IUpdateUserSkillsUseCase";
import { UserMapper } from "../../mappers/UserMapper";

export class UpdateUserSkillsUseCase implements IUpdateUserSkillsUseCase {
    constructor(
        private readonly _userRepositoryFactory: IUserRepositoryFactory
    ) { }

    async execute(userId: string, skills: string[]): Promise<UserResponseDTO> {
        
        const workerRepo = this._userRepositoryFactory.getRepository(Role.WORKER);
        const clientRepo = this._userRepositoryFactory.getRepository(Role.CLIENT);

        let user = await workerRepo.findById(userId);
        let repo = workerRepo;

        if(!user) {
            user = await clientRepo.findById(userId);
            repo = clientRepo;
        }

        if(!user) throw new Error("User Not Found");

        const normalizedSkills = [
            ...new Set(skills.map(s=>s.trim()).filter(Boolean)),
        ];

        const updated = await repo.updateById(userId, {
            skills: normalizedSkills,
        })
        if (!updated) throw new Error("Failed to update skills")

        return UserMapper.toResponseDTO(updated)
    }
}