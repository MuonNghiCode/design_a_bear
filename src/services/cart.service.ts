import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
    CreateCartRequest,
    GetCartResponse,
    AddToCartRequest,
    AddToCartResponse,
    Cart,
    CartItem,
} from "@/types";

class CartService extends BaseApiService {
    async getCart(cartId: string): Promise<GetCartResponse> {
        return this.get<Cart>(
            `${API_ENDPOINTS.CARTS.BASE}/${cartId}`,
            undefined,
            { withCredentials: false },
        );
    }

    async createCart(data: CreateCartRequest): Promise<GetCartResponse> {
        return this.post<Cart>(
            API_ENDPOINTS.CARTS.BASE,
            data,
            { withCredentials: false },
        );
    }

    async addItemToCart(data: AddToCartRequest): Promise<AddToCartResponse> {
        return this.post<CartItem>(
            API_ENDPOINTS.CARTS.ITEMS,
            data,
            { withCredentials: false },
        );
    }
}

export const cartService = new CartService();
