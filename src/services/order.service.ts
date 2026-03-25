import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { CreateOrderFromCartRequest, Order, ApiResponse } from "@/types";

class OrderService extends BaseApiService {
    async createOrderFromCart(cartId: string, orderData: CreateOrderFromCartRequest): Promise<ApiResponse<Order>> {
        const url = API_ENDPOINTS.ORDERS.FROM_CART.replace("{cartId}", cartId);
        return this.post<Order>(
            url,
            orderData,
            { withCredentials: false } 
        );
    }
}

export const orderService = new OrderService();
