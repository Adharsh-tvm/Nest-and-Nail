import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
import { AddAddressDTO } from "../../dtos/AddressDTO";
import { IAddUserAddressUseCase } from "../../interfaces/address/IUpdateUserAddressUseCase";
import { UserMapper } from "../../mappers/UserMapper";
import { randomUUID } from "crypto";

export class AddUserAddressUseCase implements IAddUserAddressUseCase {
    constructor(private readonly _userRepoFactory: IUserRepositoryFactory) { }

    async execute(userId: string, data: AddAddressDTO) {
        const clientRepo = this._userRepoFactory.getRepository(Role.CLIENT);
        const workerRepo = this._userRepoFactory.getRepository(Role.WORKER);

        let user = await clientRepo.findById(userId);
        let repo = clientRepo;

        if (!user) {
            user = await workerRepo.findById(userId);
            repo = workerRepo;
        }

        if (!user) throw new Error("User not found");

        user.address ??= [];

        if (data.isDefault) {
            user.address.forEach(a => (a.isDefault = false));
        }

        user.address.push({
            addressId: randomUUID(),
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
            createdAt: new Date(),
            updatedAt: new Date(),
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

