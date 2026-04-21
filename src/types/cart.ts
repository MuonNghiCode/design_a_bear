import { type ProductCardProps } from "@/components/shared/ProductCard";

export interface CartProduct extends ProductCardProps {
  description: string;
  slug?: string;
  productType?: string;
  size?: string;
  sizeTag?: string;
  sku?: string;
  href?: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  variantId?: string;
  buildId?: string | null;
  product: CartProduct;
  quantity: number;
  buildDetails?: any;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductCardProps, quantity?: number, buildId?: string | null, variantId?: string) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}
