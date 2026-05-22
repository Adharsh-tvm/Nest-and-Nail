import { IUserRepositoryFactory } from "../../../domain/repositories/IUserRepositoryFactory";
import { Role } from "../../../shared/enums/authEnums";
import { IDeleteUserAddressUseCase } from "../../interfaces/address/IDeleteUserAddressUseCase";


export class DeleteUserAddressUseCase implements IDeleteUserAddressUseCase {

  constructor(
    private readonly _userRepoFactory: IUserRepositoryFactory
  ) { }

  async execute(userId: string, addressId: string): Promise<void> {
    const clientRepo = this._userRepoFactory.getRepository(Role.CLIENT);
    const workerRepo = this._userRepoFactory.getRepository(Role.WORKER);

    let user = await clientRepo.findById(userId);
    let repo = clientRepo;

    if (!user) {
      user = await workerRepo.findById(userId);
      repo = workerRepo;
    }

    if (!user?.address) {
      throw new Error("User or address not found");
    }

    const filtered = user.address.filter(
      a => a.addressId !== addressId
    );

    if (filtered.length === user.address.length) {
      throw new Error("Address not found");
    }

    // Ensure one default remains
    if (
      filtered.length > 0 &&
      !filtered.some(a => a.isDefault)
    ) {
      filtered[0].isDefault = true;
    }

    const updatedUser = await repo.updateById(userId, {
      address: filtered,
    });

    if (!updatedUser) {
      throw new Error("Failed to delete address");
    }
  }
}
