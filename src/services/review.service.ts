import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  CanReviewProductResponse,
  GetProductReviewsRequest,
  GetProductReviewsResponse,
  GetProductReviewsResponseData,
} from "@/types";

class ReviewService extends BaseApiService {
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
}

export const reviewService = new ReviewService();
