import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  ApiResponse,
  Promotion,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  PromotionResponseData,
} from "@/types";

class PromotionService extends BaseApiService {
  async getAllPromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.get<Promotion[]>(API_ENDPOINTS.PROMOTIONS.GET_ALL);
  }

  async getActivePromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.get<Promotion[]>(API_ENDPOINTS.PROMOTIONS.GET_ACTIVE);
  }

  async getPromotionById(id: string): Promise<ApiResponse<Promotion>> {
    return this.get<Promotion>(`${API_ENDPOINTS.PROMOTIONS.GET_BY_ID}/${id}`);
  }

  async getPromotionByCode(code: string): Promise<ApiResponse<Promotion>> {
    return this.get<Promotion>(`${API_ENDPOINTS.PROMOTIONS.GET_BY_CODE}/${code}`);
  }

  async createPromotion(payload: CreatePromotionRequest): Promise<ApiResponse<Promotion>> {
    return this.post<Promotion>(
      API_ENDPOINTS.PROMOTIONS.CREATE,
      payload as unknown as Record<string, unknown>,
    );
  }

  async updatePromotion(
    id: string,
    payload: UpdatePromotionRequest,
  ): Promise<ApiResponse<Promotion>> {
    return this.put<Promotion>(
      `${API_ENDPOINTS.PROMOTIONS.UPDATE}/${id}`,
      payload as unknown as Record<string, unknown>,
    );
  }

  async deletePromotion(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${API_ENDPOINTS.PROMOTIONS.DELETE}/${id}`);
  }

  async validatePromotion(
    code: string,
    userId?: string,
    orderAmount?: number,
  ): Promise<ApiResponse<boolean>> {
    const queryParams: Record<string, unknown> = {};
    if (userId) queryParams.userId = userId;
    if (orderAmount) queryParams.orderAmount = orderAmount;

    return this.get<boolean>(
      `${API_ENDPOINTS.PROMOTIONS.VALIDATE}/${code}`,
      queryParams,
    );
  }
}

export const promotionService = new PromotionService();
