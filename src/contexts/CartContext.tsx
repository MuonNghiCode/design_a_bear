"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { type ProductCardProps } from "@/components/shared/ProductCard";
import { type CartContextType, type CartItem } from "@/types/cart";

const CartContext = createContext<CartContextType | null>(null);

const MOCK_ITEMS: CartItem[] = [
  {
    product: {
      id: "bear-brown-happy",
      name: "Gấu Nâu Brownie Hạnh Phúc",
      description:
        "Chú gấu với chip AI dạy Toán, chất liệu bông tơ tằm siêu nhẹ, an toàn cho bé.",
      price: 450000,
      image: "/teddy_bear.png",
      badge: "Toán",
      badgeColor: "#17409A",
    },
    quantity: 2,
  },
  {
    product: {
      id: "bear-pink-melody",
      name: "Gấu Hồng Melody Âm Nhạc",
      description:
        "Dạy bé yêu âm nhạc qua hàng trăm bài hát và giai điệu vui nhộn.",
      price: 520000,
      image: "/teddy_bear.png",
      badge: "Âm nhạc",
      badgeColor: "#FF6B9D",
    },
    quantity: 1,
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(MOCK_ITEMS);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: ProductCardProps, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
