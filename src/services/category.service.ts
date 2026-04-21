import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  GetCategoriesResponse,
  GetCategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiResponse,
} from "@/types";

class CategoryService extends BaseApiService {
  async getCategories(): Promise<GetCategoriesResponse> {
    return this.get(API_ENDPOINTS.CATEGORIES.GET_ALL, undefined, {
      withCredentials: false,
    });
  }

  async getCategoryById(id: string): Promise<GetCategoryResponse> {
    const url = API_ENDPOINTS.CATEGORIES.GET_BY_ID.replace("{id}", id);
    return this.get(url, undefined, {
      withCredentials: false,
    });
  }

  async createCategory(
    payload: CreateCategoryRequest,
  ): Promise<GetCategoryResponse> {
    return this.post(API_ENDPOINTS.CATEGORIES.CREATE, payload, {
      withCredentials: false,
    });
  }

  async updateCategory(
    id: string,
    payload: UpdateCategoryRequest,
  ): Promise<GetCategoryResponse> {
    const url = API_ENDPOINTS.CATEGORIES.UPDATE.replace("{id}", id);
    return this.put(url, payload, {
      withCredentials: false,
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.CATEGORIES.DELETE.replace("{id}", id);
    return this.delete(url, {
      withCredentials: false,
    });
  }
}

export const categoryService = new CategoryService();
