import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  CanReviewProductResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
  GetProductAverageRatingResponse,
  GetProductReviewsRequest,
  GetProductReviewsResponse,
  GetProductReviewsResponseData,
  GetUserReviewsResponse,
  UpdateReviewRequest,
  UpdateReviewResponse,
} from "@/types";

class ReviewService extends BaseApiService {
  async getUserReviews(userId: string): Promise<GetUserReviewsResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.GET_BY_USER.replace(
      "{userId}",
      userId,
    );
    return this.get(endpoint, undefined, { withCredentials: false });
  }

  async createReview(payload: CreateReviewRequest): Promise<CreateReviewResponse> {
    return this.post(API_ENDPOINTS.REVIEWS.CREATE, payload, {
      withCredentials: false,
    });
  }

  async updateReview(
    reviewId: string,
    payload: UpdateReviewRequest,
  ): Promise<UpdateReviewResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.UPDATE.replace("{id}", reviewId);
    return this.put<null>(endpoint, payload, { withCredentials: false });
  }

  async deleteReview(reviewId: string): Promise<DeleteReviewResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.DELETE.replace("{id}", reviewId);
    return this.delete<null>(endpoint, { withCredentials: false });
  }

  async getProductReviews(
    productId: string,
    params?: GetProductReviewsRequest,
  ): Promise<GetProductReviewsResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT.replace(
      "{productId}",
      productId,
    );

    return this.get<GetProductReviewsResponseData>(
      endpoint,
      params as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async canReviewProduct(productId: string): Promise<CanReviewProductResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.CAN_REVIEW.replace(
      "{productId}",
      productId,
    );

    return this.get<boolean>(
      endpoint,
      undefined,
      { withCredentials: false },
    );
  }

  async getProductAverageRating(
    productId: string,
  ): Promise<GetProductAverageRatingResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.GET_AVERAGE.replace(
      "{productId}",
      productId,
    );
    return this.get<number>(endpoint, undefined, { withCredentials: false });
  }
}

export const reviewService = new ReviewService();
