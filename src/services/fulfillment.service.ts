import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types/responses";
import {
  CreateFulfillmentRequest,
  UpdateFulfillmentRequest,
} from "@/types/requests";
import { FulfillmentResponse } from "@/types/responses";

class FulfillmentService extends BaseApiService {
  async getById(id: string): Promise<ApiResponse<FulfillmentResponse>> {
    return this.get<FulfillmentResponse>(`/api/Fulfillments/${id}`);
  }

  async getByOrderId(orderId: string): Promise<ApiResponse<FulfillmentResponse[]>> {
    return this.get<FulfillmentResponse[]>(`/api/Fulfillments/order/${orderId}`);
  }

  async create(
    request: CreateFulfillmentRequest
  ): Promise<ApiResponse<FulfillmentResponse>> {
    return this.post<FulfillmentResponse>(`/api/Fulfillments`, request);
  }

  async update(
    id: string,
    request: UpdateFulfillmentRequest
  ): Promise<ApiResponse<void>> {
    return this.put<void>(`/api/Fulfillments/${id}`, request);
  }
}

export const fulfillmentService = new FulfillmentService();
