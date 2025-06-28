import { CartItem } from "@/hooks/useCart";
import { ShippingAddress } from "./ShippingAddress";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "card" | "esewa" | "khalti";

export interface Order {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  orderedAt: string;
}
