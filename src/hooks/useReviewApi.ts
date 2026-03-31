"use client";

import { useCallback, useState } from "react";
import { reviewService } from "@/services/review.service";
import type { GetProductReviewsRequest, ProductReview } from "@/types";

function unwrapValue<T>(response: {
  value: T;
  isFailure: boolean;
  error?: { description?: string };
}): T {
  if (response.isFailure) {
    throw new Error(response.error?.description || "API request failed");
  }
  return response.value;
}

export function useReviewApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProductReviews = useCallback(
    async (
      productId: string,
      params?: GetProductReviewsRequest,
    ): Promise<{
      items: ProductReview[];
      pageIndex: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await reviewService.getProductReviews(productId, params);
        return unwrapValue(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể tải đánh giá sản phẩm";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const canReviewProduct = useCallback(async (productId: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await reviewService.canReviewProduct(productId);
      return unwrapValue(response);
    } catch {
      // If the endpoint fails (e.g. not logged in), treat as not eligible to review.
      return false;
    }
  }, []);

  return { loading, error, getProductReviews, canReviewProduct };
}
