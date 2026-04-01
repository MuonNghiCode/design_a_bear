import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  ApproveReviewResponse,
  CanReviewProductResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
  GetAllReviewsRequest,
  GetAllReviewsResponse,
  GetProductAverageRatingResponse,
  GetProductReviewsRequest,
  GetProductReviewsResponse,
  GetProductReviewsResponseData,
  GetReviewRepliesResponse,
  GetUserReviewsResponse,
  RejectReviewResponse,
  ReviewReply,
  ReplyReviewResponse,
  StaffReplyReviewRequest,
  UpdateReviewRequest,
  UpdateReviewResponse,
} from "@/types";

class ReviewService extends BaseApiService {
  async getAllReviews(params?: GetAllReviewsRequest): Promise<GetAllReviewsResponse> {
    return this.get<GetProductReviewsResponseData>(
      API_ENDPOINTS.REVIEWS.GET_ALL,
      params as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async approveReview(reviewId: string): Promise<ApproveReviewResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.APPROVE.replace("{id}", reviewId);
    return this.put<null>(endpoint, undefined, { withCredentials: false });
  }

  async rejectReview(reviewId: string): Promise<RejectReviewResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.REJECT.replace("{id}", reviewId);
    return this.put<null>(endpoint, undefined, { withCredentials: false });
  }

  async replyReview(
    reviewId: string,
    payload: StaffReplyReviewRequest,
  ): Promise<ReplyReviewResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.REPLY.replace("{id}", reviewId);
    return this.post<ReviewReply>(endpoint, payload, { withCredentials: false });
  }

  async getReviewReplies(reviewId: string): Promise<GetReviewRepliesResponse> {
    const endpoint = API_ENDPOINTS.REVIEWS.GET_REPLIES.replace("{id}", reviewId);
    return this.get<ReviewReply[]>(endpoint, undefined, { withCredentials: false });
  }

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
