import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

import {
  API_BASE_URL,
  API_HEADERS,
  STORAGE_KEYS,
  API_ERROR_MESSAGES,
} from "../constants";
import { ApiResponse } from "../types";

class BaseApiService {
  protected api: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.api = axios.create({
      baseURL,
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  protected extractErrorMessage(error: unknown): string {
    const axiosError = error as AxiosError<any>;
    const data = axiosError.response?.data;

    // Force detailed error log for debugging
    console.group("--- [API Error Detail] ---");
    console.log("URL:", axiosError.config?.url);
    console.log("Status:", axiosError.response?.status);
    console.log("Data:", data);
    console.groupEnd();

    if (!data) {
      if (axiosError.code === "ERR_NETWORK") {
        return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
      }
      return axiosError.message || API_ERROR_MESSAGES.NETWORK_ERROR;
    }

    if (typeof data === "string") return data;

    // 1. Handle our custom Result structure
    if (data.error?.description) {
      return data.error.description;
    }

    // 2. Handle ASP.NET Core Validation Errors
    const modelStateErrors = data?.errors;
    if (modelStateErrors && typeof modelStateErrors === "object") {
      const firstFieldErrors = Object.values(modelStateErrors).find(
        (fieldErrors) =>
          Array.isArray(fieldErrors) && (fieldErrors as any).length > 0,
      );
      if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
        return firstFieldErrors[0] as string;
      }
    }

    return (
      data?.title || data?.message || axiosError.message || "Đã có lỗi xảy ra."
    );
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
          if (token) {
            config.headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const url = (error.config?.url ?? "").toLowerCase();
        const isPublicEndpoint =
          url.includes("/login") ||
          url.includes("/signup") ||
          url.includes("/verify-email") ||
          url.includes("/google-login") ||
          url.includes("/google-complete-profile");

        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !isPublicEndpoint
        ) {
          if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem("dab_user");
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
          }
        }
        return Promise.reject(error);
      },
    );
  }

  protected async get<T>(
    url: string,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, {
        params,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  protected async post<T>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  protected async put<T>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  protected async delete<T>(
    url: string,
    config?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }
}

export default BaseApiService;
