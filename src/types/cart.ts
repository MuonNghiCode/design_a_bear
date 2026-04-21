import { type ProductCardProps } from "@/components/shared/ProductCard";

export interface CartItem {
  cartItemId: string;
  buildId?: string | null;
  product: ProductCardProps;
  quantity: number;
  sizeTag?: string;
  sizeDetails?: string;
  accessories?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }[];
  availableStock?: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (
    product: ProductCardProps,
    quantity?: number,
    buildId?: string | null,
    sizeTag?: string,
    sizeDetails?: string,
    accessories?: { id: string; name: string; price: number; image?: string }[],
  ) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}
