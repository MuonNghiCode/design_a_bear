import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse, AccessoryResponse, Inventory } from "@/types";

class AccessoryService extends BaseApiService {
  async getAll(): Promise<ApiResponse<AccessoryResponse[]>> {
    return this.get<AccessoryResponse[]>(API_ENDPOINTS.ACCESSORIES.GET_ALL);
  }

  async getById(id: string): Promise<ApiResponse<AccessoryResponse>> {
    return this.get<AccessoryResponse>(
      API_ENDPOINTS.ACCESSORIES.GET_BY_ID.replace("{id}", id)
    );
  }

  async getByProductId(productId: string): Promise<ApiResponse<AccessoryResponse[]>> {
    return this.get<AccessoryResponse[]>(
      API_ENDPOINTS.ACCESSORIES.GET_BY_PRODUCT.replace("{productId}", productId)
    );
  }

  async getSmartChip(): Promise<ApiResponse<AccessoryResponse>> {
    return this.get<AccessoryResponse>(API_ENDPOINTS.ACCESSORIES.SMART_CHIP);
  }

  async create(payload: Partial<AccessoryResponse>): Promise<ApiResponse<AccessoryResponse>> {
    return this.post<AccessoryResponse>(
      API_ENDPOINTS.ACCESSORIES.CREATE,
      payload as Record<string, unknown>
    );
  }

  async update(id: string, payload: Partial<AccessoryResponse>): Promise<ApiResponse<unknown>> {
    return this.put<unknown>(
      API_ENDPOINTS.ACCESSORIES.UPDATE.replace("{id}", id),
      payload as Record<string, unknown>
    );
  }

  async deleteAccessory(id: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>(
      API_ENDPOINTS.ACCESSORIES.DELETE.replace("{id}", id)
    );
  }

  async addToProduct(productId: string, accessoryId: string): Promise<ApiResponse<unknown>> {
    return this.post<unknown>(
      API_ENDPOINTS.ACCESSORIES.ADD_TO_PRODUCT,
      {},
      { productId, accessoryId }
    );
  }

  async removeFromProduct(productId: string, accessoryId: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>(
      API_ENDPOINTS.ACCESSORIES.REMOVE_FROM_PRODUCT,
      { productId, accessoryId }
    );
  }

  async getInventory(accessoryId: string): Promise<ApiResponse<Inventory[]>> {
    return this.get<Inventory[]>(
      API_ENDPOINTS.INVENTORIES.BY_ACCESSORY.replace("{accessoryId}", accessoryId)
    );
  }

  async adjustStock(id: string, delta: number, locationId: string): Promise<ApiResponse<null>> {
    const params = new URLSearchParams();
    params.append("id", id);
    params.append("delta", delta.toString());
    params.append("locationId", locationId);
    
    const url = `${API_ENDPOINTS.INVENTORIES.ACCESSORY_ADJUST}?${params.toString()}`;
    return this.post<null>(url, {});
  }
}

export const accessoryService = new AccessoryService();
