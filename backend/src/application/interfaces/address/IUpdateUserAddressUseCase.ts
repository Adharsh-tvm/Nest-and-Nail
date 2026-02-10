import { AddAddressDTO } from "../../dtos/AddressDTO";
import { UserResponseDTO } from "../../dtos/UserDTO";

export interface IAddUserAddressUseCase {
    execute(
        userId: string,
        data: AddAddressDTO
    ): Promise<UserResponseDTO>;
}