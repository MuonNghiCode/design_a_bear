import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import {
  CalculateShippingFeeRequest,
  ShippingFeeResponse,
} from "@/types/shipping";

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
}

export const shippingService = new ShippingService();
