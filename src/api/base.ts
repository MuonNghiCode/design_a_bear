import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

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

    private setupInterceptors(): void {
        // Request interceptor
        this.api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                const isPublicEndpoint = error.config?.url?.includes('/login') || 
                                       error.config?.url?.includes('/register');
                
                if (error.response?.status === 401 && !isPublicEndpoint) {
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }
        )
    }

    protected async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
        const response = await this.api.get<ApiResponse<T>>(url, { params });
        return response.data;
    }

    protected async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        const response = await this.api.post<ApiResponse<T>>(url, data);
        return response.data;
    }

    protected async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
        const response = await this.api.put<ApiResponse<T>>(url, data);
        return response.data;
    }

    protected async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response = await this.api.delete<ApiResponse<T>>(url);
        return response.data;
    }
}

export default BaseApiService;