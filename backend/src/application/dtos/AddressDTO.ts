export interface AddressDTO {
  addressId: string;
  label: "HOME" | "WORK" | "OTHER";
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export type UpdateAddressDTO = Partial<AddressDTO>;

export type AddAddressDTO = Omit<AddressDTO, "addressId">;

