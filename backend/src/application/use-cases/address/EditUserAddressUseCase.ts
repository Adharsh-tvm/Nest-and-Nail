import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
import { UpdateAddressDTO } from "../../dtos/AddressDTO";
import { IEditUserAddressUseCase } from "../../interfaces/address/IEditUserAddressUseCase";

export class EditUserAddressUseCase implements IEditUserAddressUseCase {

    constructor(
        private readonly userRepoFactory: IUserRepositoryFactory
    ) { }

    async execute(
        userId: string,
        addressId: string,
        data: UpdateAddressDTO
    ): Promise<void> {
        const clientRepo = this.userRepoFactory.getRepository(Role.CLIENT);
        const workerRepo = this.userRepoFactory.getRepository(Role.WORKER);

        let user = await clientRepo.findById(userId);
        let repo = clientRepo;

        if (!user) {
            user = await workerRepo.findById(userId);
            repo = workerRepo;
        }

        if (!user?.address) {
            throw new Error("User or address not found");
        }

        const address = user.address.find(
            a => a.addressId === addressId
        );

        if (!address) {
            throw new Error("Address not found");
        }

        // Handle default switch
        if (data.isDefault) {
            user.address.forEach(a => (a.isDefault = false));
        }

        Object.assign(address, {
            ...data,
            location:
                data.lat && data.lng
                    ? {
                        type: "Point",
                        coordinates: [data.lng, data.lat],
                    }
                    : address.location,
            updatedAt: new Date(),
        });

        const updatedUser = await repo.updateById(userId, {
            address: user.address,
        });

        if (!updatedUser) {
            throw new Error("Failed to update address");
        }
    }
}
