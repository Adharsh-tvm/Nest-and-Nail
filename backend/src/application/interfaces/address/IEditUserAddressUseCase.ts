import { UpdateAddressDTO } from "../../dtos/AddressDTO";

export interface IEditUserAddressUseCase {
  execute(
    userId: string,
    addressId: string,
    data: UpdateAddressDTO
  ): Promise<void>;
}
