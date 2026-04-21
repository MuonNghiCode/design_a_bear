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
import { mapApiCartItemToUI } from "@/utils/cart.mapper";

const CartContext = createContext<CartContextType | null>(null);

/**
 * CartProvider: The Orchestrator for shopping cart state and API synchronization.
 */
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

  /**
   * Internal helper to retrieve or initialize a CartId for the user.
   */
  const getOrCreateCartId = useCallback(async (): Promise<string> => {
    let cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
    if (cartId) return cartId;

    const userObj = localStorage.getItem(STORAGE_KEYS.USER);
    let userId = null;
    if (userObj) {
      try {
        const user = JSON.parse(userObj);
        userId = user.id || null;
      } catch {}
    }

    const newCart = await createCart({ userId, currency: "VND" });
    if (newCart?.cartId) {
      localStorage.setItem(STORAGE_KEYS.CART_ID, newCart.cartId);
      return newCart.cartId;
    }
    
    throw new Error("Failed to initialize shopping cart.");
  }, [createCart]);

  /**
   * Synchronizes the local state with the latest API data.
   */
  const loadCart = useCallback(async () => {
    try {
      const cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
      if (!cartId) return null;

      const cart = await getCart(cartId);
      if (cart && cart.cartItems) {
        setItems((prev) => {
          const prevMap = new Map(prev.map(i => [i.cartItemId, i]));
          // Map each API item using the robust fallback logic in the mapper
          return cart.cartItems.reverse().map(apiItem => 
            mapApiCartItemToUI(apiItem, prevMap.get(apiItem.cartItemId))
          );
        });
        return cartId;
      }
    } catch (err) {
      console.warn("Cart synchronization failed, clearing local session.", err);
      localStorage.removeItem(STORAGE_KEYS.CART_ID);
      setItems([]);
    }
    return null;
  }, [getCart]);

  // Initial Load
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /**
   * Action: Add item to cart
   */
  const addItem = useCallback(
    async (
      product: ProductCardProps,
      quantity = 1,
      buildId: string | null = null,
      variantId?: string,
    ) => {
      try {
        const cartId = await getOrCreateCartId();

        const response = await addItemToCart({
          cartId,
          productId: product.id,
          variantId: variantId || product.variantId || "",
          buildId,
          quantity,
          unitPriceSnapshot: product.price,
          productName: product.name,
          productImageUrl: product.image ?? null,
          productNameSnapshot: product.name,
          productImageUrlSnapshot: product.image ?? null,
        });

        if (response) {
          // Handle potential CartId rotation (e.g. anonymous cart claimed by login)
          if (response.cartId && response.cartId !== cartId) {
            localStorage.setItem(STORAGE_KEYS.CART_ID, response.cartId);
          }

          // Merge the new item into the UI state
          setItems((prev) => {
            const existingIdx = prev.findIndex(i => i.cartItemId === response.cartItemId);
            const mappedItem = mapApiCartItemToUI(response, existingIdx >= 0 ? prev[existingIdx] : undefined);

            if (existingIdx >= 0) {
              const next = [...prev];
              next[existingIdx] = mappedItem;
              return next;
            }
            return [mappedItem, ...prev];
          });
        }

        setIsOpen(true);
      } catch (err) {
        console.error("Cart Add Error:", err);
        throw err;
      }
    },
    [getOrCreateCartId, addItemToCart]
  );

  /**
   * Action: Remove item (Optimistic)
   */
  const removeItem = useCallback(
    async (cartItemId: string) => {
      const backup = [...items];
      setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
      
      try {
        await removeCartItem(cartItemId);
      } catch (err) {
        setItems(backup); // Rollback on failure
        console.error("Failed to remove cart item:", err);
      }
    },
    [items, removeCartItem]
  );

  /**
   * Action: Update quantity (Optimistic)
   */
  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity <= 0) return removeItem(cartItemId);

      const backup = [...items];
      setItems(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i));

      try {
        await updateItemQuantity(cartItemId, quantity);
      } catch (err) {
        setItems(backup); // Rollback on failure
        console.error("Failed to update quantity:", err);
      }
    },
    [items, removeItem, updateItemQuantity]
  );

  /**
   * Action: Clear Cart
   */
  const clearCart = useCallback(async () => {
    const cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);
    setItems([]);
    
    if (cartId) {
      try {
        await clearCartItems(cartId);
      } catch (err) {
        console.error("Failed to clear cart:", err);
        loadCart(); // Reconciliation
      }
    }
  }, [clearCartItems, loadCart]);

  // Derived Values
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

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
