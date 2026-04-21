import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { Location, ApiResponse } from "@/types";

class LocationService extends BaseApiService {
  async getLocations(): Promise<ApiResponse<Location[]>> {
    return this.get<Location[]>(API_ENDPOINTS.LOCATIONS.BASE);
  }

  async getLocationById(id: string): Promise<ApiResponse<Location>> {
    const url = API_ENDPOINTS.LOCATIONS.BY_ID.replace("{id}", id);
    return this.get<Location>(url);
  }

  async createLocation(data: Partial<Location>): Promise<ApiResponse<Location>> {
    return this.post<Location>(API_ENDPOINTS.LOCATIONS.BASE, data);
  }

  async updateLocation(id: string, data: Partial<Location>): Promise<ApiResponse<Location>> {
    const url = API_ENDPOINTS.LOCATIONS.BY_ID.replace("{id}", id);
    return this.put<Location>(url, data);
  }

  async deleteLocation(id: string): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.LOCATIONS.BY_ID.replace("{id}", id);
    return this.delete<null>(url);
  }
}

export const locationService = new LocationService();
