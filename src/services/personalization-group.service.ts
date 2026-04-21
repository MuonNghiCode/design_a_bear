import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  CreatePersonalizationGroupRequest,
  UpdatePersonalizationGroupRequest,
  GetPersonalizationGroupsResponse,
  GetPersonalizationGroupResponse,
  CreatePersonalizationGroupResponse,
  UpdatePersonalizationGroupResponse,
  DeletePersonalizationGroupResponse,
} from "@/types";

class PersonalizationGroupService extends BaseApiService {
  async getGroups(): Promise<GetPersonalizationGroupsResponse> {
    return this.get(API_ENDPOINTS.PERSONALIZATION_GROUPS.BASE, undefined, {
      withCredentials: false,
    });
  }

  async getGroupById(id: string): Promise<GetPersonalizationGroupResponse> {
    const url = API_ENDPOINTS.PERSONALIZATION_GROUPS.BY_ID.replace("{id}", id);
    return this.get(url, undefined, {
      withCredentials: false,
    });
  }

  async createGroup(
    payload: CreatePersonalizationGroupRequest,
  ): Promise<CreatePersonalizationGroupResponse> {
    return this.post(API_ENDPOINTS.PERSONALIZATION_GROUPS.BASE, payload, {
      withCredentials: false,
    });
  }

  async updateGroup(
    id: string,
    payload: UpdatePersonalizationGroupRequest,
  ): Promise<UpdatePersonalizationGroupResponse> {
    const url = API_ENDPOINTS.PERSONALIZATION_GROUPS.BY_ID.replace("{id}", id);
    return this.put(url, payload, {
      withCredentials: false,
    });
  }

  async deleteGroup(id: string): Promise<DeletePersonalizationGroupResponse> {
    const url = API_ENDPOINTS.PERSONALIZATION_GROUPS.BY_ID.replace("{id}", id);
    return this.delete(url, {
      withCredentials: false,
    });
  }
}

export const personalizationGroupService = new PersonalizationGroupService();
