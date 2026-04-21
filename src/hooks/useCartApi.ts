"use client";

import { useCallback, useState } from "react";
import { cartService } from "@/services/cart.service";
import type { CreateCartRequest, AddToCartRequest, Cart, CartItem } from "@/types";
import { STORAGE_KEYS } from "@/constants";

function unwrapValue<T>(response: { value: T; isFailure: boolean; error?: { description?: string } }): T {
    if (response.isFailure) {
        throw new Error(response.error?.description || "API request failed");
    }
    return response.value;
}

export function useCartApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCart = useCallback(async (cartId: string): Promise<Cart> => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.getCart(cartId);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Thay lấy giỏ hàng thất bại";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createCart = useCallback(async (data: CreateCartRequest): Promise<Cart> => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.createCart(data);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Tạo giỏ hàng thất bại";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addItemToCart = useCallback(async (data: AddToCartRequest): Promise<CartItem> => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.addItemToCart(data);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Thêm vào giỏ hàng thất bại";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateItemQuantity = useCallback(async (itemId: string, quantity: number): Promise<CartItem> => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.updateItemQuantity(itemId, quantity);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Cập nhật số lượng thất bại";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeCartItem = useCallback(async (itemId: string): Promise<Cart> => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.removeItem(itemId);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Xoá sản phẩm thất bại";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCartItems = useCallback(async (cartId: string): Promise<Cart> => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.clearCart(cartId);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Xoá giỏ hàng thất bại";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddToCart = useCallback(
        async (productId: string, quantity: number, unitPrice: number, buildId: string | null = null, variantId: string = ""): Promise<CartItem> => {
            let cartId = localStorage.getItem(STORAGE_KEYS.CART_ID);

            // Check if cart exists and is valid
            if (cartId) {
                try {
                    await getCart(cartId);
                } catch {
                    // Invalid/expired cart
                    cartId = null;
                }
            }

            if (!cartId) {
                const userObj = localStorage.getItem(STORAGE_KEYS.USER);
                let userId = null;
                if (userObj) {
                    try {
                        const user = JSON.parse(userObj);
                        userId = user.id || null;
                    } catch { }
                }
                const newCart = await createCart({ userId, currency: "VND" });
                cartId = newCart.cartId;
                localStorage.setItem(STORAGE_KEYS.CART_ID, cartId);
            }

            return await addItemToCart({
                cartId,
                productId,
                variantId,
                buildId,
                quantity,
                unitPriceSnapshot: unitPrice
            });
        },
        [getCart, createCart, addItemToCart]
    );

    return { loading, error, getCart, createCart, addItemToCart, updateItemQuantity, removeCartItem, clearCartItems, handleAddToCart };
}
