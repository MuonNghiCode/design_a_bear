import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { Inventory } from "@/types/inventory";
import { ApiResponse } from "@/types";

class InventoryService extends BaseApiService {
  /**
   * Get inventory for a specific location and identity.
   * GET /api/Inventories/location/{locationId}/identity/{identityId}?isAccessory=bool
   */
  async getAtLocation(locationId: string, identityId: string, isAccessory: boolean = false): Promise<ApiResponse<Inventory>> {
    const url = `${API_ENDPOINTS.INVENTORIES.BASE}/location/${locationId}/identity/${identityId}?isAccessory=${isAccessory}`;
    return super.get<Inventory>(url);
  }

  /**
   * Get all inventory records for a specific product across all locations.
   * Matches Backend's InventoriesController: GET /api/Inventories/product/{productId}
   */
  async getByProductId(productId: string): Promise<ApiResponse<Inventory[]>> {
    const url = `${API_ENDPOINTS.INVENTORIES.BASE}/product/${productId}`;
    return this.get<Inventory[]>(url, undefined, { withCredentials: false });
  }

  /**
   * Get all inventory records for a specific accessory across all locations.
   * Matches Backend's InventoriesController: GET /api/Inventories/accessory/{accessoryId}
   */
  async getByAccessoryId(accessoryId: string): Promise<ApiResponse<Inventory[]>> {
    const url = `${API_ENDPOINTS.INVENTORIES.BASE}/accessory/${accessoryId}`;
    return this.get<Inventory[]>(url, undefined, { withCredentials: false });
  }

  /**
   * Get total available stock across all locations for a specific identity.
   * Matches Backend's InventoriesController: GET /api/Inventories/total?identityId=...&isAccessory=...
   */
  async getTotalAvailable(identityId: string, isAccessory: boolean = false): Promise<ApiResponse<{ totalAvailable: number }>> {
    const params = {
      identityId,
      isAccessory
    };
    return this.get<{ totalAvailable: number }>(API_ENDPOINTS.INVENTORIES.TOTAL, params);
  }

  /**
   * Batch check stock sequentially.
   */
  async batchCheck(items: { identityId: string; isAccessory: boolean }[]): Promise<Record<string, number>> {
    const results: Record<string, number> = {};
    for (const item of items) {
      try {
        const res = await this.getTotalAvailable(item.identityId, item.isAccessory);
        results[item.identityId] = res.isSuccess ? res.value.totalAvailable : 0;
      } catch {
        results[item.identityId] = 0;
      }
    }
    return results;
  }

  /**
   * Unified Stock Adjustment.
   * Matches Backend's InventoriesController: POST /api/Inventories/adjust?identityId=...&isAccessory=...&delta=...&locationId=...
   */
  async adjustStock(identityId: string, isAccessory: boolean, delta: number, locationId?: string): Promise<ApiResponse<null>> {
    const params: any = {
      identityId,
      isAccessory,
      delta
    };
    if (locationId) params.locationId = locationId;

    return this.post<null>(API_ENDPOINTS.INVENTORIES.ADJUST, null, { params });
  }

  /**
   * Unified Reservation.
   */
  async reserveStock(identityId: string, isAccessory: boolean, quantity: number, locationId: string): Promise<ApiResponse<null>> {
    const params = { identityId, isAccessory, quantity, locationId };
    return this.post<null>(API_ENDPOINTS.INVENTORIES.RESERVE, null, { params });
  }

  /**
   * Unified Release Reservation.
   */
  async releaseReservation(identityId: string, isAccessory: boolean, quantity: number, locationId: string): Promise<ApiResponse<null>> {
    const params = { identityId, isAccessory, quantity, locationId };
    return this.post<null>(API_ENDPOINTS.INVENTORIES.RELEASE, null, { params });
  }
}

export const inventoryService = new InventoryService();
