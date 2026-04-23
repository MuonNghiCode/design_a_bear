import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  GetCollectionsResponse,
  GetCollectionResponse,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  ApiResponse,
} from "@/types";

class CollectionService extends BaseApiService {
  async getCollections(): Promise<GetCollectionsResponse> {
    return this.get(API_ENDPOINTS.COLLECTIONS.GET_ALL, undefined, {
      withCredentials: false,
    });
  }

  async getCollectionById(id: string): Promise<GetCollectionResponse> {
    const url = API_ENDPOINTS.COLLECTIONS.GET_BY_ID.replace("{id}", id);
    return this.get(url, undefined, {
      withCredentials: false,
    });
  }

  async getCollectionBySlug(slug: string): Promise<GetCollectionResponse> {
    const url = API_ENDPOINTS.COLLECTIONS.GET_BY_SLUG.replace("{slug}", slug);
    return this.get(url, undefined, {
      withCredentials: false,
    });
  }

  async createCollection(
    payload: CreateCollectionRequest,
  ): Promise<GetCollectionResponse> {
    return this.post(API_ENDPOINTS.COLLECTIONS.CREATE, payload);
  }

  async updateCollection(
    id: string,
    payload: UpdateCollectionRequest,
  ): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.COLLECTIONS.UPDATE.replace("{id}", id);
    return this.put(url, payload);
  }

  async deleteCollection(id: string): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.COLLECTIONS.DELETE.replace("{id}", id);
    return this.delete(url);
  }

  async addProductToCollection(
    collectionId: string,
    productId: string,
  ): Promise<ApiResponse<null>> {
    const url = `${API_ENDPOINTS.COLLECTIONS.ADD_PRODUCT}?collectionId=${collectionId}&productId=${productId}`;
    return this.post(url, {});
  }

  async removeProductFromCollection(
    collectionId: string,
    productId: string,
  ): Promise<ApiResponse<null>> {
    const url = `${API_ENDPOINTS.COLLECTIONS.REMOVE_PRODUCT}?collectionId=${collectionId}&productId=${productId}`;
    return this.delete(url);
  }
}

export const collectionService = new CollectionService();
