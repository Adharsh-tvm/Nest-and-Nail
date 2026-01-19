export interface AddressDTO {
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

export interface AddAddressDTO {
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
