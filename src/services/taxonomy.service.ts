import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  GetCategoriesResponse,
  GetCharactersResponse,
  ProductCategory,
  CharacterItem,
} from "@/types";

class TaxonomyService extends BaseApiService {
  async getCategories(): Promise<GetCategoriesResponse> {
    return this.get<ProductCategory[]>(API_ENDPOINTS.CATEGORIES.GET_ALL, undefined, {
      withCredentials: false,
    });
  }

  async getCharacters(): Promise<GetCharactersResponse> {
    return this.get<CharacterItem[]>(API_ENDPOINTS.CHARACTERS.GET_ALL, undefined, {
      withCredentials: false,
    });
  }
}

export const taxonomyService = new TaxonomyService();
