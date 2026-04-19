import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { Inventory, ApiResponse } from "@/types";

class InventoryService extends BaseApiService {
  async getByProductId(productId: string): Promise<ApiResponse<Inventory[]>> {
    const url = API_ENDPOINTS.INVENTORIES.BY_PRODUCT.replace("{productId}", productId);
    return this.get<Inventory[]>(url, undefined, { withCredentials: false });
  }

  async getTotalAvailable(productId: string): Promise<ApiResponse<{ totalAvailable: number }>> {
    const url = API_ENDPOINTS.INVENTORIES.TOTAL_AVAILABLE.replace("{productId}", productId);
    return this.get<{ totalAvailable: number }>(url, undefined, { withCredentials: false });
  }

  /**
   * Adjusts stock for a specific location and product
   * @param locationId The warehouse location ID
   * @param productId The product ID
   * @param delta Positive to restock, negative to deduct
   */
  async adjustStock(locationId: string, productId: string, delta: number): Promise<ApiResponse<null>> {
    const url = `${API_ENDPOINTS.INVENTORIES.ADJUST}?locationId=${locationId}&productId=${productId}&delta=${delta}`;
    return this.post<null>(url, {}, { withCredentials: false });
  }

  async reserveStock(locationId: string, productId: string, quantity: number): Promise<ApiResponse<null>> {
    const url = `${API_ENDPOINTS.INVENTORIES.RESERVE}?locationId=${locationId}&productId=${productId}&quantity=${quantity}`;
    return this.post<null>(url, {}, { withCredentials: false });
  }

  async releaseReservation(locationId: string, productId: string, quantity: number): Promise<ApiResponse<null>> {
    const url = `${API_ENDPOINTS.INVENTORIES.RELEASE}?locationId=${locationId}&productId=${productId}&quantity=${quantity}`;
    return this.post<null>(url, {}, { withCredentials: false });
  }
}

export const inventoryService = new InventoryService();
