import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  GetCategoriesResponse,
  GetCharactersResponse,
  ProductCategory,
  ProductCharacter,
} from "@/types";

class TaxonomyService extends BaseApiService {
  async getCategories(): Promise<GetCategoriesResponse> {
    return this.get<ProductCategory[]>(
      API_ENDPOINTS.CATEGORIES.GET_ALL,
      undefined,
      {
        withCredentials: false,
      },
    );
  }

  async getCharacters(): Promise<GetCharactersResponse> {
    return this.get<ProductCharacter[]>(
      API_ENDPOINTS.CHARACTERS.GET_ALL,
      undefined,
      {
        withCredentials: false,
      },
    );
  }
}

export const taxonomyService = new TaxonomyService();
