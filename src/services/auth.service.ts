import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type {
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  LogoutRequest,
  LogoutResponse,
  LogoutResponseData,
  ProfileResponse,
  ProfileResponseData,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyEmailResponseData,
} from "@/types";

class AuthService extends BaseApiService {
  async signin(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponseData>(API_ENDPOINTS.AUTH.LOGIN, credentials, {
      withCredentials: false,
    });
  }

  async signup(data: RegisterRequest): Promise<RegisterResponse> {
    return this.post<string>(API_ENDPOINTS.AUTH.SIGNUP, data, {
      withCredentials: false,
    });
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return this.post<VerifyEmailResponseData>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data, {
      withCredentials: false,
    });
  }

  async logout(logoutData: LogoutRequest): Promise<LogoutResponse> {
    return this.post<LogoutResponseData>(API_ENDPOINTS.AUTH.LOGOUT, logoutData);
  }

  async getProfile(): Promise<ProfileResponse> {
    return this.get<ProfileResponseData>(API_ENDPOINTS.AUTH.PROFILE);
  }

  async getUserProfile(userId: string): Promise<ProfileResponse> {
    const endpoint = API_ENDPOINTS.AUTH.GET_PROFILE.replace("{userId}", userId);
    return this.get<ProfileResponseData>(endpoint);
  }
}

export const authService = new AuthService();
