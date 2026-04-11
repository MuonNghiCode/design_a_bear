"use client";

import { useCallback, useState } from "react";
import { reviewService } from "@/services/review.service";
import type {
  CreateReviewRequest,
  GetAllReviewsRequest,
  GetProductReviewsRequest,
  ProductReview,
  ReviewReply,
  StaffReplyReviewRequest,
  UpdateReplyReviewRequest,
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

  const getAllReviews = useCallback(
    async (
      params?: GetAllReviewsRequest,
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
        const response = await reviewService.getAllReviews(params);
        return unwrapValue(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể tải danh sách đánh giá";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getReviewReplies = useCallback(
    async (reviewId: string): Promise<ReviewReply[]> => {
      try {
        const response = await reviewService.getReviewReplies(reviewId);
        return unwrapValue(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể tải phản hồi đánh giá";
        setError(message);
        throw err;
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

  const approveReview = useCallback(async (reviewId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewService.approveReview(reviewId);
      if (response.isFailure) {
        throw new Error(response.error?.description || "Không thể duyệt đánh giá");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể duyệt đánh giá";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectReview = useCallback(async (reviewId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewService.rejectReview(reviewId);
      if (response.isFailure) {
        throw new Error(response.error?.description || "Không thể từ chối đánh giá");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể từ chối đánh giá";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const replyReview = useCallback(
    async (
      reviewId: string,
      payload: StaffReplyReviewRequest,
    ): Promise<ReviewReply> => {
      setLoading(true);
      setError(null);
      try {
        const response = await reviewService.replyReview(reviewId, payload);
        return unwrapValue(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể phản hồi đánh giá";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateReplyReview = useCallback(
    async (
      replyId: string,
      payload: UpdateReplyReviewRequest,
    ): Promise<ReviewReply> => {
      setLoading(true);
      setError(null);
      try {
        const response = await reviewService.updateReplyReview(replyId, payload);
        return unwrapValue(response);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Không thể cập nhật phản hồi đánh giá";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    getAllReviews,
    getReviewReplies,
    getProductReviews,
    getUserReviews,
    canReviewProduct,
    getProductAverageRating,
    createReview,
    updateReview,
    deleteReview,
    approveReview,
    rejectReview,
    replyReview,
    updateReplyReview,
  };
}
