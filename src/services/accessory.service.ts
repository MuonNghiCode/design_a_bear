import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { 
  ApiResponse, 
  AccessoryResponse, 
  CreateAccessoryRequest, 
  UpdateAccessoryRequest 
} from "@/types";

class AccessoryService extends BaseApiService {
  async getAll(): Promise<ApiResponse<AccessoryResponse[]>> {
    return this.get<AccessoryResponse[]>(API_ENDPOINTS.ACCESSORIES.GET_ALL);
  }

  async getById(id: string): Promise<ApiResponse<AccessoryResponse>> {
    return this.get<AccessoryResponse>(`${API_ENDPOINTS.ACCESSORIES.GET_BY_ID}/${id}`);
  }

  async getByProductId(productId: string): Promise<ApiResponse<AccessoryResponse[]>> {
    return this.get<AccessoryResponse[]>(`${API_ENDPOINTS.ACCESSORIES.GET_BY_PRODUCT}/${productId}`);
  }

  async getSmartChip(): Promise<ApiResponse<AccessoryResponse>> {
    return this.get<AccessoryResponse>(API_ENDPOINTS.ACCESSORIES.GET_SMART_CHIP);
  }

  async create(payload: CreateAccessoryRequest): Promise<ApiResponse<AccessoryResponse>> {
    return this.post<AccessoryResponse>(
      API_ENDPOINTS.ACCESSORIES.CREATE,
      payload as unknown as Record<string, unknown>
    );
  }

  async update(id: string, payload: UpdateAccessoryRequest): Promise<ApiResponse<AccessoryResponse>> {
    return this.put<AccessoryResponse>(
      `${API_ENDPOINTS.ACCESSORIES.UPDATE}/${id}`,
      payload as unknown as Record<string, unknown>
    );
  }

  async deleteAccessory(id: string): Promise<ApiResponse<unknown>> {
    return super.delete<unknown>(`${API_ENDPOINTS.ACCESSORIES.DELETE}/${id}`);
  }

  async addToProduct(productId: string, accessoryId: string): Promise<ApiResponse<unknown>> {
    return this.post<unknown>(
      `${API_ENDPOINTS.ACCESSORIES.MATRIX}?productId=${productId}&accessoryId=${accessoryId}`,
      {}
    );
  }

  async removeFromProduct(productId: string, accessoryId: string): Promise<ApiResponse<unknown>> {
    return super.delete<unknown>(
      `${API_ENDPOINTS.ACCESSORIES.MATRIX}?productId=${productId}&accessoryId=${accessoryId}`
    );
  }
}

export const accessoryService = new AccessoryService();
