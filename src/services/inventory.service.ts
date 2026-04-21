import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { Inventory, ApiResponse } from "@/types";

class InventoryService extends BaseApiService {
  async getByProductId(productId: string): Promise<ApiResponse<Inventory[]>> {
    const url = API_ENDPOINTS.INVENTORIES.BY_PRODUCT.replace("{productId}", productId);
    return this.get<Inventory[]>(url, undefined, { withCredentials: false });
  }

  async getByAccessoryId(accessoryId: string): Promise<ApiResponse<Inventory[]>> {
    const url = API_ENDPOINTS.INVENTORIES.BY_ACCESSORY.replace("{accessoryId}", accessoryId);
    return this.get<Inventory[]>(url, undefined, { withCredentials: false });
  }

  async getTotalAvailable(productId: string): Promise<ApiResponse<{ totalAvailable: number }>> {
    const url = API_ENDPOINTS.INVENTORIES.TOTAL_AVAILABLE.replace("{productId}", productId);
    return this.get<{ totalAvailable: number }>(url, undefined, { withCredentials: false });
  }

  async adjustStock(
    productId: string | null, 
    variantId: string | null | undefined, 
    accessoryId: string | null | undefined,
    delta: number, 
    locationId: string
  ): Promise<ApiResponse<null>> {
    let params = `delta=${delta}&locationId=${locationId}`;
    if (productId) params += `&productId=${productId}`;
    if (variantId) params += `&variantId=${variantId}`;
    if (accessoryId) params += `&accessoryId=${accessoryId}`;
    
    const url = `${API_ENDPOINTS.INVENTORIES.ADJUST}?${params}`;
    return this.post<null>(url, {}, { withCredentials: false });
  }

  async reserveStock(
    productId: string | null, 
    variantId: string | null | undefined, 
    accessoryId: string | null | undefined,
    quantity: number, 
    locationId: string
  ): Promise<ApiResponse<null>> {
    let params = `quantity=${quantity}&locationId=${locationId}`;
    if (productId) params += `&productId=${productId}`;
    if (variantId) params += `&variantId=${variantId}`;
    if (accessoryId) params += `&accessoryId=${accessoryId}`;

    const url = `${API_ENDPOINTS.INVENTORIES.RESERVE}?${params}`;
    return this.post<null>(url, {}, { withCredentials: false });
  }

  async releaseReservation(
    productId: string | null, 
    variantId: string | null | undefined, 
    accessoryId: string | null | undefined,
    quantity: number, 
    locationId: string
  ): Promise<ApiResponse<null>> {
    let params = `quantity=${quantity}&locationId=${locationId}`;
    if (productId) params += `&productId=${productId}`;
    if (variantId) params += `&variantId=${variantId}`;
    if (accessoryId) params += `&accessoryId=${accessoryId}`;

    const url = `${API_ENDPOINTS.INVENTORIES.RELEASE}?${params}`;
    return this.post<null>(url, {}, { withCredentials: false });
  }
}

export const inventoryService = new InventoryService();
