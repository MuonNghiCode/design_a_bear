"use client";

import { useCallback, useState } from "react";
import { reviewService } from "@/services/review.service";
import type {
  CreateReviewRequest,
  GetProductReviewsRequest,
  ProductReview,
  UpdateReviewRequest,
} from "@/types";

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

  const getUserReviews = useCallback(async (userId: string): Promise<ProductReview[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewService.getUserReviews(userId);
      return unwrapValue(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải đánh giá của người dùng";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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

  const getProductAverageRating = useCallback(
    async (productId: string): Promise<number> => {
      try {
        const response = await reviewService.getProductAverageRating(productId);
        return unwrapValue(response);
      } catch {
        return 0;
      }
    },
    [],
  );

  const createReview = useCallback(
    async (payload: CreateReviewRequest): Promise<ProductReview> => {
      setLoading(true);
      setError(null);
      try {
        const response = await reviewService.createReview(payload);
        return unwrapValue(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể tạo đánh giá";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateReview = useCallback(
    async (reviewId: string, payload: UpdateReviewRequest): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await reviewService.updateReview(reviewId, payload);
        if (response.isFailure) {
          throw new Error(response.error?.description || "Không thể cập nhật đánh giá");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể cập nhật đánh giá";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteReview = useCallback(async (reviewId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewService.deleteReview(reviewId);
      if (response.isFailure) {
        throw new Error(response.error?.description || "Không thể xóa đánh giá");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể xóa đánh giá";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProductReviews,
    getUserReviews,
    canReviewProduct,
    getProductAverageRating,
    createReview,
    updateReview,
    deleteReview,
  };
}
