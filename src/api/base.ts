import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';

import { API_BASE_URL, API_HEADERS, STORAGE_KEYS } from '../constants';
import { ApiResponse } from '../types';



class BaseApiService {
    protected api: AxiosInstance;

    constructor(baseURL: string = API_BASE_URL) {
        this.api = axios.create({
            baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.setupInterceptors();
    }

    private extractErrorMessage(error: unknown): string {
        const axiosError = error as AxiosError<{
            title?: string;
            error?: { description?: string };
            errors?: Record<string, string[]>;
        }>;

        const data = axiosError.response?.data;

        if (data?.error?.description) {
            return data.error.description;
        }

        const modelStateErrors = data?.errors;
        if (modelStateErrors && typeof modelStateErrors === 'object') {
            const firstFieldErrors = Object.values(modelStateErrors).find(
                (fieldErrors) => Array.isArray(fieldErrors) && fieldErrors.length > 0
            );
            if (firstFieldErrors?.[0]) {
                return firstFieldErrors[0];
            }
        }

        if (data?.title) {
            return data.title;
        }

        if (axiosError.message) {
            return axiosError.message;
        }

        return 'Đã có lỗi xảy ra';
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
                    if (token) {
                        config.headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                const url = (error.config?.url ?? '').toLowerCase();
                const isPublicEndpoint =
                    url.includes('/login') ||
                    url.includes('/signup') ||
                    url.includes('/verify-email') ||
                    url.includes('/google-login') ||
                    url.includes('/google-complete-profile');

                if (error.response?.status === 401 && !isPublicEndpoint) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(STORAGE_KEYS.TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.USER);
                        window.location.href = '/';
                    }
                }
                return Promise.reject(error);
            }
        )
    }

    protected async get<T>(url: string, params?: Record<string, unknown>, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.get<ApiResponse<T>>(url, { params, ...config });
            return response.data;
        } catch (error) {
            throw new Error(this.extractErrorMessage(error));
        }
    }

    protected async post<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.post<ApiResponse<T>>(url, data, config);
            return response.data;
        } catch (error) {
            throw new Error(this.extractErrorMessage(error));
        }
    }

    protected async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.put<ApiResponse<T>>(url, data);
            return response.data;
        } catch (error) {
            throw new Error(this.extractErrorMessage(error));
        }
    }

    protected async delete<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.api.delete<ApiResponse<T>>(url);
            return response.data;
        } catch (error) {
            throw new Error(this.extractErrorMessage(error));
        }
    }
}

export default BaseApiService;