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
    return this.get<Inventory[]>(url);
  }

  async getTotalAvailable(productId: string, variantId?: string): Promise<ApiResponse<{ totalAvailable: number }>> {
    let url = API_ENDPOINTS.INVENTORIES.TOTAL_AVAILABLE.replace("{productId}", productId);
    if (variantId) url += `?variantId=${variantId}`;
    return this.get<{ totalAvailable: number }>(url);
  }

  /**
   * Adjusts stock for a specific location and item
   */
  async adjustStock(
    locationId: string,
    delta: number,
    productId?: string | null,
    variantId?: string | null,
    accessoryId?: string | null
  ): Promise<ApiResponse<null>> {
    const params = new URLSearchParams();
    params.append("locationId", locationId);
    params.append("delta", delta.toString());
    if (productId) params.append("productId", productId);
    if (variantId) params.append("variantId", variantId);
    if (accessoryId) params.append("accessoryId", accessoryId);

    const url = `${API_ENDPOINTS.INVENTORIES.ADJUST}?${params.toString()}`;
    return this.post<null>(url, {});
  }

  async reserveStock(
    locationId: string,
    quantity: number,
    productId?: string | null,
    variantId?: string | null,
    accessoryId?: string | null
  ): Promise<ApiResponse<null>> {
    const params = new URLSearchParams();
    params.append("locationId", locationId);
    params.append("quantity", quantity.toString());
    if (productId) params.append("productId", productId);
    if (variantId) params.append("variantId", variantId);
    if (accessoryId) params.append("accessoryId", accessoryId);

    const url = `${API_ENDPOINTS.INVENTORIES.RESERVE}?${params.toString()}`;
    return this.post<null>(url, {});
  }

  async releaseReservation(
    locationId: string,
    quantity: number,
    productId?: string | null,
    variantId?: string | null,
    accessoryId?: string | null
  ): Promise<ApiResponse<null>> {
    const params = new URLSearchParams();
    params.append("locationId", locationId);
    params.append("quantity", quantity.toString());
    if (productId) params.append("productId", productId);
    if (variantId) params.append("variantId", variantId);
    if (accessoryId) params.append("accessoryId", accessoryId);

    const url = `${API_ENDPOINTS.INVENTORIES.RELEASE}?${params.toString()}`;
    return this.post<null>(url, {});
  }
}

export const inventoryService = new InventoryService();
