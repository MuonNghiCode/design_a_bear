import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  ApiResponse,
  GetProductsRequest,
  GetProductsResponse,
  GetProductsResponseData,
  GetProductDetailResponse,
  GetPersonalizationRulesResponse,
  PersonalizationRule,
  ProductDetail,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";

class ProductService extends BaseApiService {
  async getPersonalizationRules(
    productId: string,
  ): Promise<GetPersonalizationRulesResponse> {
    return this.get<PersonalizationRule[]>(
      `${API_ENDPOINTS.PERSONALIZATION_RULES.GET_ACTIVE}/${productId}/active`,
    );
  }
  async getProducts(params?: GetProductsRequest): Promise<GetProductsResponse> {
    return this.get<GetProductsResponseData>(
      API_ENDPOINTS.PRODUCTS.GET_ALL,
      params as Record<string, unknown>,
    );
  }

  async createProduct(
    payload: CreateProductRequest,
  ): Promise<GetProductDetailResponse> {
    return this.post<ProductDetail>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      payload as unknown as Record<string, unknown>,
    );
  }

  async updateProduct(
    id: string,
    payload: UpdateProductRequest,
  ): Promise<ApiResponse<unknown>> {
    return this.put<unknown>(
      `${API_ENDPOINTS.PRODUCTS.UPDATE}/${id}`,
      payload as unknown as Record<string, unknown>,
    );
  }

  async getProductBySlug(slug: string): Promise<GetProductDetailResponse> {
    return this.get<ProductDetail>(
      `${API_ENDPOINTS.PRODUCTS.GET_BY_SLUG}/${slug}`,
    );
  }

  async deleteProduct(id: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>(`${API_ENDPOINTS.PRODUCTS.DELETE}/${id}`);
  }

  async getProductById(id: string): Promise<GetProductDetailResponse> {
    return this.get<ProductDetail>(
      `${API_ENDPOINTS.PRODUCTS.GET_BY_ID}/${id}`,
    );
  }

  async getTopProducts(count: number = 20): Promise<ApiResponse<ProductListItem[]>> {
    return this.get<ProductListItem[]>(
      `${API_ENDPOINTS.PRODUCTS.GET_ALL}/top`,
      { count },
    );
  }
}

export const productService = new ProductService();
