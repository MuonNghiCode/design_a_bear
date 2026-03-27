import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  ProfileResponse,
  GetUserResponse,
  GetUsersResponse,
  UserDetail,
  ApiResponse,
} from "@/types";

class UserService extends BaseApiService {
  async getProfile(): Promise<ProfileResponse> {
    return this.get<ProfileResponse>(API_ENDPOINTS.USERS.PROFILE, undefined, {
      withCredentials: false,
    });
  }

  async getUsers(): Promise<GetUsersResponse> {
    return this.get<UserDetail[]>(API_ENDPOINTS.USERS.GET_ALL, undefined, {
      withCredentials: false,
    });
  }

  async getUserById(id: string): Promise<GetUserResponse> {
    return this.get<UserDetail>(
      `${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`,
      undefined,
      { withCredentials: false },
    );
  }

  async blockUser(id: string): Promise<ApiResponse<string>> {
    const url = API_ENDPOINTS.USERS.BLOCK.replace("{userId}", id);
    return this.put<string>(url, undefined, { withCredentials: false });
  }

  async unblockUser(id: string): Promise<ApiResponse<string>> {
    const url = API_ENDPOINTS.USERS.UNBLOCK.replace("{userId}", id);
    return this.put<string>(url, undefined, { withCredentials: false });
  }
}

export const userService = new UserService();
