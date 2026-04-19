"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type ProductCardProps } from "@/components/shared/ProductCard";
import {
  type CartContextType,
  type CartItem as UICartItem,
} from "@/types/cart";
import { useCartApi } from "@/hooks/useCartApi";
import { STORAGE_KEYS } from "@/constants";
import type { CartItem as ApiCartItem } from "@/types/responses";

const CartContext = createContext<CartContextType | null>(null);


function mapApiToUI(
  apiItem: ApiCartItem,
  previousItem?: UICartItem,
): UICartItem {
  const safeProductName =
    apiItem.productNameSnapshot ??
    apiItem.productName ??
    previousItem?.product.name ??
    "Sản phẩm";
  
  return {
    cartItemId: apiItem.cartItemId,
    buildId: apiItem.buildId,
    product: {
      id: apiItem.productId,
      name: safeProductName,
      description: apiItem.sku
        ? `Mã SP: ${apiItem.sku}`
        : (previousItem?.product.description ?? "Sản phẩm trong giỏ"),
      price: apiItem.unitPriceSnapshot ?? apiItem.variantPrice ?? 0,
      image:
        apiItem.productImageUrl ??
        previousItem?.product.image ??
        "/teddy_bear.png",
      badge: apiItem.productType === "BASE_BEAR" ? "Gấu bông" : "Sản phẩm",
      badgeColor: "#17409A",
      href: apiItem.productSlug
        ? `/products/${apiItem.productSlug}`
        : previousItem?.product.href,
    },
    quantity: apiItem.quantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<UICartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const {
    getCart,
    createCart,
    addItemToCart,
    updateItemQuantity,
    removeCartItem,
    clearCartItems,
  } = useCartApi();

  const loadCart = useCallback(async () => {
    try {
      let cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
      if (cartId) {
        const cart = await getCart(cartId);
        if (cart && cart.cartItems) {
          setItems((prev) => {
            const prevByCartItemId = new Map(
              prev.map((item) => [item.cartItemId, item]),
            );
            return cart.cartItems.reverse().map((apiItem) =>
              mapApiToUI(apiItem, prevByCartItemId.get(apiItem.cartItemId)),
            );
          });
          return cartId;
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.CART_ID);
    }
    return null;
  }, [getCart]);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    async (
      product: ProductCardProps,
      quantity = 1,
      buildId: string | null = null,
    ) => {
      try {
        let cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);

        if (!cartId) {
          const userObj = localStorage.getItem(STORAGE_KEYS.USER);
          let userId = null;
          if (userObj) {
            try {
              const user = JSON.parse(userObj);
              userId = user.id || null;
            } catch {}
          }
          const newCart = await createCart({ userId, currency: "VND" });
          cartId = newCart.cartId;
          localStorage.setItem(STORAGE_KEYS.CART_ID, cartId!);
        }


        const addRes = await addItemToCart({
          cartId: cartId!,
          productId: product.id,
          buildId: buildId,
          quantity,
          unitPriceSnapshot: product.price,
          productName: product.name,
          productImageUrl: product.image ?? null,
          productNameSnapshot: product.name,
          productImageUrlSnapshot: product.image ?? null,
        });

        if (addRes?.cartId && addRes.cartId !== cartId) {
          cartId = addRes.cartId;
          localStorage.setItem(STORAGE_KEYS.CART_ID, cartId);
        }

        // Optimistic update — inject item directly into state
        if (addRes) {
          // IMPORTANT: Re-fetch cart is the safest way to ensure state consistency 
          // because the user might have multiple customized versions of the same product.
          // However, for "Wow" factor, we can try to update the local state.
          
          setItems((prev) => {
            const existingIndex = prev.findIndex(
              (i) => i.cartItemId === addRes.cartItemId,
            );
            
            if (existingIndex >= 0) {
              return prev.map((i, idx) =>
                idx === existingIndex
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              );
            } else {
              return [
                {
                  cartItemId: addRes.cartItemId,
                  buildId: buildId,
                  product: {
                    ...product,
                    href: product.href || `/products/${product.id}`,
                  },
                  quantity,
                },
                ...prev,
              ];
            }
          });
        }

        setIsOpen(true);
      } catch (err) {
        throw err;
      }
    },
    [loadCart, createCart, addItemToCart],
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      // Optimistic update
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));

      try {
        await removeCartItem(cartItemId);
      } catch (err) {
        console.error("Failed to remove item from cart", err);
      }
    },
    [removeCartItem, loadCart],
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(cartItemId);
        return;
      }

      // Optimistic quantity update
      setItems((prev) =>
        prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i)),
      );

      try {
        await updateItemQuantity(cartItemId, quantity);
      } catch (err) {
        console.error("Failed to update cart item quantity", err);
        loadCart(); // Sync on fail
      }
    },
    [removeItem, updateItemQuantity, loadCart],
  );


  const clearCart = useCallback(async () => {
    setItems([]); // Optimistic

    const cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
    if (cartId && items.length > 0) {
      try {
        await clearCartItems(cartId);
      } catch (err) {
        console.error("Failed to clear cart", err);
        loadCart();
      }
    }
  }, [items.length, clearCartItems, loadCart]);

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
