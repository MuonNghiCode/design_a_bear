import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
    CreateOrderFromCartRequest,
    Order,
    ApiResponse,
    GetOrdersByUserResponse,
    GetOrderDetailResponse,
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

    async getOrderById(orderId: string): Promise<GetOrderDetailResponse> {
        const url = API_ENDPOINTS.ORDERS.GET_BY_ID.replace("{id}", orderId);
        return this.get(url, undefined, { withCredentials: false });
    }
}

export const orderService = new OrderService();
