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

type VariantMeta = {
  productName: string;
  variantName: string | null;
  image: string | null;
  href: string | null;
  description: string | null;
};

function parseNameParts(name: string): {
  productName: string;
  variantName: string | null;
} {
  const trimmed = name.trim();
  const match = trimmed.match(/^(.*)\s\(([^)]+)\)$/);
  if (!match) return { productName: trimmed, variantName: null };
  return {
    productName: match[1].trim(),
    variantName: match[2].trim(),
  };
}

function getVariantMetaMap(): Record<string, VariantMeta> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART_VARIANT_META);
    return raw ? (JSON.parse(raw) as Record<string, VariantMeta>) : {};
  } catch {
    return {};
  }
}

function setVariantMetaMap(map: Record<string, VariantMeta>) {
  localStorage.setItem(STORAGE_KEYS.CART_VARIANT_META, JSON.stringify(map));
}

function mapApiToUI(
  apiItem: ApiCartItem,
  previousItem?: UICartItem,
): UICartItem {
  const variantMeta = getVariantMetaMap()[apiItem.variantId];
  const safeProductName =
    apiItem.productName ??
    apiItem.productNameSnapshot ??
    variantMeta?.productName ??
    previousItem?.product.name ??
    "Sản phẩm";
  const safeVariantName =
    apiItem.variantName?.trim() ??
    variantMeta?.variantName ??
    previousItem?.product.variantName ??
    null;
  const composedName = safeVariantName
    ? `${safeProductName} (${safeVariantName})`
    : safeProductName;

  return {
    cartItemId: apiItem.cartItemId,
    buildId: apiItem.buildId,
    product: {
      id: apiItem.variantId,
      name: composedName,
      description: apiItem.sku
        ? `Mã SP: ${apiItem.sku}`
        : variantMeta?.description ??
          previousItem?.product.description ??
          "Sản phẩm trong giỏ",
      price: apiItem.unitPriceSnapshot ?? apiItem.variantPrice ?? 0,
      image:
        apiItem.productImageUrl ??
        variantMeta?.image ??
        previousItem?.product.image ??
        "/teddy_bear.png",
      badge: apiItem.productType === "BASE_BEAR" ? "Gấu bông" : "Sản phẩm",
      badgeColor: "#17409A",
      href: apiItem.productSlug
        ? `/products/${apiItem.productSlug}`
        : variantMeta?.href ?? previousItem?.product.href,
      variantName: safeVariantName ?? undefined,
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
            // Map previous items by cartItemId for stable metadata persistence
            const prevMap = new Map(prev.map((i) => [i.cartItemId, i]));
            return cart.cartItems.map((apiItem) =>
              mapApiToUI(apiItem, prevMap.get(apiItem.cartItemId)),
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
        let cartId = await loadCart();
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
          localStorage.setItem(STORAGE_KEYS.CART_ID, cartId);
        }

        const nameParts = parseNameParts(product.name);
        const variantMetaMap = getVariantMetaMap();
        variantMetaMap[product.id] = {
          productName: nameParts.productName,
          variantName: product.variantName ?? nameParts.variantName,
          image: product.image ?? null,
          href: product.href ?? null,
          description: product.description ?? null,
        };
        setVariantMetaMap(variantMetaMap);

        const addRes = await addItemToCart({
          cartId,
          variantId: product.id,
          buildId: buildId,
          quantity,
          unitPriceSnapshot: product.price,
          productName: product.name,
          variantName: product.variantName ?? null,
          productImageUrl: product.image ?? null,
        });

        if (addRes?.cartId && addRes.cartId !== cartId) {
          cartId = addRes.cartId;
          localStorage.setItem(STORAGE_KEYS.CART_ID, cartId);
        }

        if (addRes) {
          setItems((prev) => {
            // Find existing item with SAME variantId AND SAME buildId
            const existingIndex = prev.findIndex(
              (i) => i.product.id === product.id && i.buildId === buildId,
            );

            if (existingIndex >= 0) {
              return prev.map((item, idx) =>
                idx === existingIndex
                  ? {
                      ...item,
                      cartItemId: addRes.cartItemId, // Sync with latest ID from server
                      quantity: item.quantity + quantity,
                    }
                  : item,
              );
            } else {
              return [
                ...prev,
                {
                  cartItemId: addRes.cartItemId,
                  buildId: buildId,
                  product: {
                    ...product,
                    href: product.href || `/products/${product.id}`,
                  },
                  quantity,
                },
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
      // Find item before filtering to keep it for the catch block sync
      const itemToDelete = items.find((i) => i.cartItemId === cartItemId);

      // Optimistic delete
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));

      if (cartItemId) {
        try {
          await removeCartItem(cartItemId);
          if (itemToDelete) {
            const variantMetaMap = getVariantMetaMap();
            delete variantMetaMap[itemToDelete.product.id];
            setVariantMetaMap(variantMetaMap);
          }
        } catch (err) {
          console.error("Failed to remove item from cart", err);
          loadCart(); // Sync on fail
        }
      }
    },
    [items, removeCartItem, loadCart],
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(cartItemId);
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
    [updateItemQuantity, removeItem, loadCart],
  );


  const clearCart = useCallback(async () => {
    setItems([]); // Optimistic
    localStorage.removeItem(STORAGE_KEYS.CART_VARIANT_META);

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
