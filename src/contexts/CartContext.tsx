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
import type { CartItem as ApiCartItem, Build } from "@/types/responses";
import BaseApiService from "@/api/base";
import { getComponentsForValidation } from "@/utils/stock_utils";
import { buildService } from "@/services/build.service";
import { inventoryService } from "@/services/inventory.service";
import { accessoryService } from "@/services/accessory.service";
import { useToast } from "@/contexts/ToastContext";

const CartContext = createContext<CartContextType | null>(null);

function mapApiToUI(
  apiItem: ApiCartItem,
  buildDetail?: Build | null,
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
    // Build details
    sizeTag:
      apiItem.variantNameSnapshot?.match(/\((.*?)\)/)?.[1] ||
      previousItem?.sizeTag,
    sizeDetails: previousItem?.sizeDetails, // Often found in variant description if available
    accessories: previousItem?.accessories, // Fallback to previous if available
    baseVariantId: buildDetail?.baseVariantId || apiItem.productId,
    availableStock: apiItem.availableStock,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<UICartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
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
          // Fetch build details in parallel if they exist
          const buildDetailsMap = new Map<string, Build>();
          const buildIds = Array.from(
            new Set(
              cart.cartItems
                .map((i) => i.buildId)
                .filter((id): id is string => !!id),
            ),
          );

          if (buildIds.length > 0) {
            await Promise.all(
              buildIds.map(async (id) => {
                try {
                  const res = await buildService.getBuildById(id);
                  if (res.isSuccess && res.value) {
                    buildDetailsMap.set(id, res.value);
                  }
                } catch (err) {
                  console.error(`Failed to fetch build ${id}`, err);
                }
              }),
            );
          }

          setItems((prev) => {
            const prevByCartItemId = new Map(
              prev.map((item) => [item.cartItemId, item]),
            );

            return cart.cartItems.reverse().map((apiItem) => {
              const buildDetail = apiItem.buildId
                ? buildDetailsMap.get(apiItem.buildId)
                : null;
              const mapped = mapApiToUI(
                apiItem,
                buildDetail,
                prevByCartItemId.get(apiItem.cartItemId),
              );

              if (buildDetail && buildDetail.buildComponents) {
                mapped.accessories = buildDetail.buildComponents.map((c) => ({
                  id: c.optionVariantId,
                  name:
                    (c as any).optionProductName ||
                    (c as any).name ||
                    "Phụ kiện",
                  price: c.priceSnapshot,
                }));
                mapped.baseVariantId = buildDetail.baseVariantId;
              }

              return mapped;
            });
          });
          return cartId;
        }
      }
    } catch (err) {
      console.error("Cart load failed:", err);
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
      sizeTag?: string,
      sizeDetails?: string,
      accessories?: {
        id: string;
        name: string;
        price: number;
        image?: string;
      }[],
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

        // --- Pre-check Stock (Required by Unified Inventory Guide) ---
        const tempItem: any = {
          product,
          accessories,
          baseVariantId: buildId ? undefined : (product as any).productId || product.id
        };
        const components = await getComponentsForValidation(tempItem);

        // Perform batch check (sequential on FE simulator)
        const stockMap = await inventoryService.batchCheck(components);
        
        // Check for any failures
        for (const comp of components) {
          const available = stockMap[comp.identityId] || 0;
          if (available < (quantity || 1)) {
            toast.error(`Sản phẩm không đủ hàng trong kho (Còn lại: ${available})`);
            return;
          }
        }
        // -----------------------------------------------------------

        const addRes = await addItemToCart({
          cartId: cartId!,
          productId: buildId ? undefined : (product as any).productId || product.id,
          variantId: buildId
            ? undefined
            : (product as any).productId
              ? product.id
              : undefined,
          buildId: buildId || null,
          quantity,
          unitPriceSnapshot: product.price,
          sizeTag,
          productImageUrlSnapshot: product.image || null,
        });

        if (addRes?.cartId && addRes.cartId !== cartId) {
          cartId = addRes.cartId;
          localStorage.setItem(STORAGE_KEYS.CART_ID, cartId);
        }

        // Optimistic update — inject item directly into state
        if (addRes) {
          setItems((prev) => {
            const existingIndex = prev.findIndex(
              (i) => i.cartItemId === addRes.cartItemId,
            );

            if (existingIndex >= 0) {
              return prev.map((i, idx) =>
                idx === existingIndex
                  ? {
                      ...i,
                      quantity: i.quantity + quantity,
                      sizeTag: sizeTag || i.sizeTag,
                      sizeDetails: sizeDetails || i.sizeDetails,
                      accessories: accessories || i.accessories,
                    }
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
                  sizeTag,
                  sizeDetails,
                  accessories,
                  availableStock: addRes.availableStock,
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
