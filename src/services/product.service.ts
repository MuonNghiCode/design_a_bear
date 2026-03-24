import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
    GetProductsRequest,
    GetProductsResponse,
    GetProductsResponseData,
    GetProductDetailResponse,
    ProductDetail,
} from "@/types";

class ProductService extends BaseApiService {
    async getProducts(params?: GetProductsRequest): Promise<GetProductsResponse> {
        return this.get<GetProductsResponseData>(
            API_ENDPOINTS.PRODUCTS.GET_ALL,
            params as Record<string, unknown>,
            { withCredentials: false },
        );
    }

    async getProductBySlug(slug: string): Promise<GetProductDetailResponse> {
        return this.get<ProductDetail>(
            `${API_ENDPOINTS.PRODUCTS.GET_BY_SLUG}/${slug}`,
            undefined,
            { withCredentials: false },
        );
    }

    async getProductById(id: string): Promise<GetProductDetailResponse> {
        return this.get<ProductDetail>(
            `${API_ENDPOINTS.PRODUCTS.GET_BY_ID}/${id}`,
            undefined,
            { withCredentials: false },
        );
    }
}

export const productService = new ProductService();
