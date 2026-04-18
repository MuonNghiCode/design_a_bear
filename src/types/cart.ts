import { type ProductCardProps } from "@/components/shared/ProductCard";

export interface CartItem {
  cartItemId: string;
  buildId?: string | null;
  product: ProductCardProps;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (
    product: ProductCardProps,
    quantity?: number,
    buildId?: string | null,
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}
