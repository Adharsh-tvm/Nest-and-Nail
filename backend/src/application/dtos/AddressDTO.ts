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

export interface UpdateAddressDTO extends Partial<AddressDTO> { }

export interface AddAddressDTO extends Omit<AddressDTO, "addressId"> { }

