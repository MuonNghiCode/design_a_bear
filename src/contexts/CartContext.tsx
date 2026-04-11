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
    product: {
      id: apiItem.variantId,
      name: composedName,
      description: apiItem.sku
        ? `Mã SP: ${apiItem.sku}`
        : (variantMeta?.description ??
          previousItem?.product.description ??
          "Sản phẩm trong giỏ"),
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
        : (variantMeta?.href ?? previousItem?.product.href),
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
        console.log("DEBUG LOAD CART:", cart);
        if (cart && cart.cartItems) {
          setItems((prev) => {
            const prevByVariantId = new Map(
              prev.map((item) => [item.product.id, item]),
            );
            return cart.cartItems.map((apiItem) =>
              mapApiToUI(apiItem, prevByVariantId.get(apiItem.variantId)),
            );
          });
          return cartId;
        }
      }
    } catch {
      // Cart invalid, remove it
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

        console.log("DEBUG ADD ITEM TO CART REQ:", {
          cartId,
          variantId: product.id,
          buildId,
          quantity,
          unitPriceSnapshot: product.price,
        });

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
          productNameSnapshot: product.name,
          variantNameSnapshot: product.variantName ?? null,
          productImageUrlSnapshot: product.image ?? null,
        });
        console.log("DEBUG ADD ITEM TO CART RES:", addRes);

        // Keep local cart id aligned with the id returned by backend.
        if (addRes?.cartId && addRes.cartId !== cartId) {
          cartId = addRes.cartId;
          localStorage.setItem(STORAGE_KEYS.CART_ID, cartId);
        }

        // Optimistic update — inject item directly into state
        // instead of relying on GET /api/Carts/{id} to return updated data
        if (addRes) {
          const existingIndex = items.findIndex(
            (i) => i.product.id === product.id,
          );
          if (existingIndex >= 0) {
            setItems((prev) =>
              prev.map((i, idx) =>
                idx === existingIndex
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            );
          } else {
            setItems((prev) => [
              ...prev,
              {
                cartItemId: addRes.cartItemId,
                product: {
                  ...product,
                  href: product.href || `/products/${product.id}`,
                },
                quantity,
              },
            ]);
          }
        }

        setIsOpen(true);
      } catch (err) {
        throw err; // Rethrow — the UI layer will show the toast
      }
    },
    [loadCart, createCart, addItemToCart],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      // Find the item to get its cartItemId
      const itemToDelete = items.find((i) => i.product.id === productId);

      // Optimistic update
      setItems((prev) => prev.filter((i) => i.product.id !== productId));

      if (itemToDelete?.cartItemId) {
        try {
          await removeCartItem(itemToDelete.cartItemId);
          const variantMetaMap = getVariantMetaMap();
          delete variantMetaMap[productId];
          setVariantMetaMap(variantMetaMap);
        } catch (err) {
          console.error("Failed to remove item from cart", err);
          // Re-fetch cart on failure to sync state
          loadCart();
        }
      }
    },
    [items, removeCartItem, loadCart],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const itemToUpdate = items.find((i) => i.product.id === productId);

      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      // Optimistic update
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
      );

      if (itemToUpdate?.cartItemId) {
        try {
          await updateItemQuantity(itemToUpdate.cartItemId, quantity);
        } catch (err) {
          console.error("Failed to update cart item quantity", err);
          loadCart(); // Sync on fail
        }
      }
    },
    [items, updateItemQuantity, removeItem, loadCart],
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
