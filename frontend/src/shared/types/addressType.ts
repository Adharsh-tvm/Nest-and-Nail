export type AddressLabel = "HOME" | "WORK" | "OTHER";

export interface Address {
  label: AddressLabel;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  lat: number;
  lng: number;

  isDefault?: boolean;
  addressId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
