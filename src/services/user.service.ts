import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { ProfileResponse } from "@/types";

class UserService extends BaseApiService {
    async getProfile(): Promise<ProfileResponse> {
        return this.get<any>(
            API_ENDPOINTS.USERS.PROFILE,
            undefined,
            { withCredentials: false } 
        );
    }
}

export const userService = new UserService();
