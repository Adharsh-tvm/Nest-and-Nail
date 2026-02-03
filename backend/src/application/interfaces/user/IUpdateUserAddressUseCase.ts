import { AddAddressDTO } from "../../dtos/AddressDTO";
import { UserResponseDTO } from "../../dtos/UserDTO";

export interface IUpdateUserAddressUseCase {
    execute(
        userId: string,
        data: AddAddressDTO
    ): Promise<UserResponseDTO>;
}