import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  ValidatePromotionRequest,
  ApplyPromotionRequest,
  CreatePaymentRequest,
} from "@/types/requests";
import type {
  PromotionResponse,
  PromotionApplyResponse,
  CreatePaymentResponse,
  ConfirmPaymentResponse,
} from "@/types/responses";

class PaymentService extends BaseApiService {
  /**
   * Validate promotion code
   */
  async validatePromotion(
    req: ValidatePromotionRequest
  ): Promise<PromotionResponse> {
    return this.post(API_ENDPOINTS.PROMOTIONS.VALIDATE, req, {
      withCredentials: false,
    });
  }

  /**
   * Apply promotion to get structured discount data
   */
  async applyPromotion(
    req: ApplyPromotionRequest
  ): Promise<PromotionApplyResponse> {
    return this.post(API_ENDPOINTS.PROMOTIONS.APPLY, req, {
      withCredentials: false,
    });
  }

  /**
   * Create payment for an order
   */
  async createPayment(
    req: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    return this.post(API_ENDPOINTS.PAYMENTS.CREATE, req, {
      withCredentials: false,
    });
  }

  /**
   * Confirm payment with payment code
   */
  async confirmPayment(
    paymentCode: string
  ): Promise<ConfirmPaymentResponse> {
    const url = `${API_ENDPOINTS.PAYMENTS.CONFIRM}/${paymentCode}`;
    return this.get(url, undefined, {
      withCredentials: false,
    });
  }
}

export const paymentService = new PaymentService();
