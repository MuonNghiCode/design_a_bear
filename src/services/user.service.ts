import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  ProfileResponse,
  GetUserResponse,
  GetUsersResponse,
  UserDetail,
} from "@/types";

class UserService extends BaseApiService {
  async getProfile(): Promise<ProfileResponse> {
    return this.get<any>(API_ENDPOINTS.USERS.PROFILE, undefined, {
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
}

export const userService = new UserService();
