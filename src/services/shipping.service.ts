import BaseApiService from "@/api/base";
import { API_ENDPOINTS, API_BASE_URL } from "@/constants";
import {
  CalculateShippingFeeRequest,
  ShippingFeeResponse,
  SubmitGhtkExpressOrderRequest,
  GhtkSubmitOrderResponse,
  GhtkTrackingStatusResponse,
} from "@/types/shipping";
import { ApiResponse } from "@/types/responses";

class ShippingService extends BaseApiService {
  /**
   * Preview shipping fee based on cart, address and transport method.
   * Based on Swagger image, parameters are sent as query string.
   */
  async calculateShippingFee(
    params: CalculateShippingFeeRequest,
  ): Promise<ShippingFeeResponse> {
    return this.post<any>(
      API_ENDPOINTS.SHIPPING.CALCULATE_FEE,
      {}, // Empty body as params are in query
      {
        params: {
          cartId: params.cartId,
          addressId: params.addressId,
          transport: params.transport || "road",
        },
        withCredentials: false,
      },
    );
  }
  async submitExpressOrder(
    request: SubmitGhtkExpressOrderRequest,
  ): Promise<ApiResponse<GhtkSubmitOrderResponse>> {
    return this.post<GhtkSubmitOrderResponse>(
      `${API_ENDPOINTS.SHIPPING.BASE}/ghtk/orders/express`,
      request,
    );
  }

  async getTrackingStatus(
    label: string,
  ): Promise<ApiResponse<GhtkTrackingStatusResponse>> {
    return this.get<GhtkTrackingStatusResponse>(
      `${API_ENDPOINTS.SHIPPING.BASE}/ghtk/orders/${label}/tracking-status`,
    );
  }

  getPrintLabelUrl(label: string): string {
    return `${API_BASE_URL}${API_ENDPOINTS.SHIPPING.BASE}/ghtk/orders/${label}/print-label`;
  }
}

export const shippingService = new ShippingService();
