import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
    GetProductsRequest,
    GetProductsResponse,
    GetProductsResponseData,
} from "@/types";

class ProductService extends BaseApiService {
    async getProducts(params?: GetProductsRequest): Promise<GetProductsResponse> {
        return this.get<GetProductsResponseData>(
            API_ENDPOINTS.PRODUCTS.GET_ALL,
            params as Record<string, unknown>,
            { withCredentials: false },
        );
    }
}

export const productService = new ProductService();
