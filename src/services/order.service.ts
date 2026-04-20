import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  CreateOrderFromCartRequest,
  Order,
  ApiResponse,
  GetOrdersByUserResponse,
  GetOrderDetailResponse,
  GetOrdersRequest,
  UpdateOrderStatusRequest,
  GetOrdersResponse,
  GetOrdersResponseData,
  GetOrderByIdResponse,
  OrderListItem,
} from "@/types";

class OrderService extends BaseApiService {
  async createOrderFromCart(
    cartId: string,
    orderData: CreateOrderFromCartRequest,
  ): Promise<ApiResponse<Order>> {
    const url = API_ENDPOINTS.ORDERS.FROM_CART.replace("{cartId}", cartId);
    return this.post<Order>(url, orderData, { withCredentials: false });
  }

  async getOrdersByUserId(userId: string): Promise<GetOrdersByUserResponse> {
    const url = API_ENDPOINTS.ORDERS.GET_BY_USER.replace("{userId}", userId);
    return this.get(url, undefined, { withCredentials: false });
  }

  async getOrders(params?: GetOrdersRequest): Promise<GetOrdersResponse> {
    return this.get<GetOrdersResponseData>(
      API_ENDPOINTS.ORDERS.GET_ALL,
      params as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async getOrderById(orderId: string): Promise<GetOrderByIdResponse> {
    const url = API_ENDPOINTS.ORDERS.GET_BY_ID.replace("{orderId}", orderId);
    return this.get<OrderListItem>(url, undefined, { withCredentials: false });
  }

  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusRequest,
  ): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.ORDERS.UPDATE_STATUS.replace(
      "{orderId}",
      orderId,
    );
    return this.put<null>(url, data, { withCredentials: false });
  }

  async cancelOrder(orderId: string): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.ORDERS.CANCEL.replace("{orderId}", orderId);
    return this.post<null>(url, {}, { withCredentials: false });
  }
}

export const orderService = new OrderService();
