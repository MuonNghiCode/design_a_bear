"use client";

import { useCallback, useMemo, useState } from "react";
import { authService } from "@/services/auth.service";
import { STORAGE_KEYS } from "@/constants";
import type {
  LoginRequest,
  LoginResponseData,
  LogoutRequest,
  LogoutResponseData,
  ProfileResponseData,
  ApiResponse,
} from "@/types";

function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (response.isFailure) {
    throw new Error(response.error?.description || "API request failed");
  }
  return response.value;
}

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signin = useCallback(async (payload: LoginRequest): Promise<LoginResponseData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signin(payload);
      const data = unwrapResponse(response);
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (payload: LogoutRequest = {}): Promise<LogoutResponseData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.logout(payload);
      const data = unwrapResponse(response);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async (): Promise<ProfileResponseData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getProfile();
      const data = unwrapResponse(response);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Get profile failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserProfile = useCallback(async (userId: string): Promise<ProfileResponseData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getUserProfile(userId);
      return unwrapResponse(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Get user profile failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      loading,
      error,
      signin,
      logout,
      getProfile,
      getUserProfile,
      clearError: () => setError(null),
    }),
    [loading, error, signin, logout, getProfile, getUserProfile],
  );
}
