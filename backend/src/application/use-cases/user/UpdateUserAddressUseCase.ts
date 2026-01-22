import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
import { IUpdateUserAddressUseCase } from "../../interfaces/IUpdateUserAddressUseCase";
import { UserMapper } from "../../mappers/UserMapper";

export class UpdateUserAddressUseCase implements IUpdateUserAddressUseCase {
    constructor(
        private readonly userRepoFactory: IUserRepositoryFactory
    ) { }

    async execute(userId: string, data: any) {
        const clientRepo = this.userRepoFactory.getRepository(Role.CLIENT);
        const workerRepo = this.userRepoFactory.getRepository(Role.WORKER);

        let user = await clientRepo.findById(userId);
        let repo = clientRepo;

        if (!user) {
            user = await workerRepo.findById(userId);
            repo = workerRepo;
        }

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.address) {
            user.address = [];
        }

        if (data.isDefault === true) {
            user.address.forEach(addr => {
                addr.isDefault = false;
            });
        }

        user.address.push({
            label: data.label,
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            zip: data.zip,
            isDefault: data.isDefault ?? false,
            location: {
                type: "Point",
                coordinates: [data.lng, data.lat],
            },
        });

        const updatedUser = await repo.updateById(userId, {
            address: user.address,
        });

        if (!updatedUser) {
            throw new Error("Failed to add address");
        }

        return UserMapper.toResponseDTO(updatedUser);
    }
}
