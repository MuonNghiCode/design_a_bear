"use client";

import { useCallback, useState } from "react";
import { productService } from "@/services/product.service";
import type { ProductDetail } from "@/types";

function unwrapValue<T>(response: { value: T; isFailure: boolean; error?: { description?: string } }): T {
    if (response.isFailure) {
        throw new Error(response.error?.description || "API request failed");
    }
    return response.value;
}

export function useProductDetailApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProductBySlug = useCallback(async (slug: string): Promise<ProductDetail> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productService.getProductBySlug(slug);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không thể tải sản phẩm";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getProductById = useCallback(async (id: string): Promise<ProductDetail> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productService.getProductById(id);
            return unwrapValue(response);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Không thể tải sản phẩm";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, getProductBySlug, getProductById };
}
