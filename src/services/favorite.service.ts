import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, GetMyFavoritesResponse, ToggleFavoriteResponse } from "@/types/responses";
import { ToggleFavoriteRequest } from "@/types/requests";

class FavoriteService extends BaseApiService {
  async getMyFavorites(pageIndex = 1, pageSize = 10): Promise<GetMyFavoritesResponse> {
    const url = `${API_ENDPOINTS.FAVORITES.BASE}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    return this.get<GetMyFavoritesResponse["value"]>(url);
  }

  async toggleFavorite(productId: string): Promise<ToggleFavoriteResponse> {
    const request: ToggleFavoriteRequest = { productId };
    return this.post<{ isAdded: boolean; message: string }>(API_ENDPOINTS.FAVORITES.TOGGLE, request);
  }
}

export const favoriteService = new FavoriteService();
