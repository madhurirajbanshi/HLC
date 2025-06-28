export type AddressCategory = "Home" | "Office";

export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  city: string;
  state: string;
  street?: string;
  zip: string;
  category: AddressCategory;
  createdAt: Date;
}