import { type ProductCardProps } from "@/components/shared/ProductCard";

export interface CartItem {
  product: ProductCardProps;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductCardProps, quantity?: number, buildId?: string | null) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}
