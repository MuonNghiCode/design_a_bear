import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { GetUserResponse, GetUsersResponse, UserDetail } from "@/types";

class UserService extends BaseApiService {
  async getUsers(): Promise<GetUsersResponse> {
    return this.get<UserDetail[]>(
      API_ENDPOINTS.USERS.GET_ALL,
      undefined,
      { withCredentials: false }
    );
  }

  async getUserById(id: string): Promise<GetUserResponse> {
    return this.get<UserDetail>(
      `${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`,
      undefined,
      { withCredentials: false }
    );
  }
}

export const userService = new UserService();
