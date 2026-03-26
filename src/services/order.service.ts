import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  GetOrdersRequest,
  UpdateOrderStatusRequest,
  GetOrdersResponse,
  GetOrdersResponseData,
  GetOrderByIdResponse,
  OrderListItem,
  ApiResponse
} from "@/types";

class OrderService extends BaseApiService {
  async getOrders(params?: GetOrdersRequest): Promise<GetOrdersResponse> {
    return this.get<GetOrdersResponseData>(
      API_ENDPOINTS.ORDERS.GET_ALL,
      params as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async getOrderById(id: string): Promise<GetOrderByIdResponse> {
    return this.get<OrderListItem>(
      `${API_ENDPOINTS.ORDERS.GET_BY_ID}/${id}`,
      undefined,
      { withCredentials: false }
    );
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<ApiResponse<null>> {
    return this.put<null>(
      `${API_ENDPOINTS.ORDERS.GET_BY_ID}/${id}/status`,
      data,
      { withCredentials: false }
    );
  }
}

export const orderService = new OrderService();
