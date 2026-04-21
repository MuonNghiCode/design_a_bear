"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/constants";
import { authService } from "@/services/auth.service";
import { useToast } from "@/contexts/ToastContext";
import type {
  GoogleCompleteProfileRequest,
  GoogleLoginResponseData,
  RegisterRequest,
} from "@/types";

export type UserRole = "admin" | "staff" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  pendingVerification: { email: string } | null;
  pendingGoogleProfile: {
    registrationToken: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: "M" | "F";
  } | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (
    credential: string,
  ) => Promise<{ requiresProfileCompletion: boolean }>;
  completeGoogleProfile: (
    data: Omit<GoogleCompleteProfileRequest, "registrationToken">,
  ) => Promise<void>;
  logout: () => void;
  signup: (data: RegisterRequest) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  clearPendingVerification: () => void;
  clearPendingGoogleProfile: () => void;
  updateCurrentUser: (patch: Partial<Pick<User, "name" | "avatar">>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

type JwtPayload = {
  id?: string;
  email?: string;
  fullname?: string;
  [ROLE_CLAIM]?: string | number;
  role?: string | number;
  role_name?: string;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(
      normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function mapRole(rawRole?: string | number, roleName?: string): UserRole {
  if (!rawRole && !roleName) return "user";

  const roleValue = rawRole !== undefined ? String(rawRole).toLowerCase() : "";
  const nameValue = roleName ? roleName.toLowerCase() : "";

  if (roleValue === "1" || roleValue === "admin" || nameValue === "admin")
    return "admin";
  if (roleValue === "2" || roleValue === "staff" || nameValue === "staff")
    return "staff";

  return "user";
}

function buildUserFromToken(token: string): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const roleValue = payload[ROLE_CLAIM] ?? payload.role;
  const roleName = payload.role_name;

  console.log("[Auth] Decoding Token Payload:", {
    email: payload.email,
    roleValue,
    roleName,
  });

  const email = payload.email ?? "";
  const id = payload.id ?? email;
  if (!id || !email) return null;

  const role = mapRole(roleValue, roleName);
  console.log("[Auth] Mapped Role:", role);

  return {
    id,
    email,
    name: payload.fullname ?? email,
    role,
    avatar: "/teddy_bear.png",
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { error: toastError } = useToast();
  const [pendingVerification, setPendingVerification] = useState<{
    email: string;
  } | null>(null);
  const [pendingGoogleProfile, setPendingGoogleProfile] = useState<{
    registrationToken: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: "M" | "F";
  } | null>(null);

  const finalizeLogin = (token: string) => {
    const parsedUser = buildUserFromToken(token);
    if (!parsedUser) {
      throw new Error("Không thể đọc thông tin người dùng từ token");
    }

    setUser(parsedUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
    localStorage.setItem("dab_user", JSON.stringify(parsedUser));
    setPendingGoogleProfile(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      toastError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      logout();

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
      }, 1500);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    const storedUser =
      localStorage.getItem(STORAGE_KEYS.USER) ??
      localStorage.getItem("dab_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem("dab_user");
      }
    }
    setLoading(false);

    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.signin({ email, password });
    if (response.isFailure) {
      throw new Error(response.error?.description || "Đăng nhập thất bại");
    }

    const token = response.value?.token;
    if (!token) {
      throw new Error("Không nhận được token đăng nhập");
    }

    finalizeLogin(token);
  };

  const loginWithGoogle = async (credential: string) => {
    const response = await authService.googleLogin({ credential });
    if (response.isFailure) {
      throw new Error(
        response.error?.description || "Đăng nhập Google thất bại",
      );
    }

    const value = (response.value ?? {}) as GoogleLoginResponseData;

    if (value.token) {
      finalizeLogin(value.token);
      return { requiresProfileCompletion: false };
    }

    if (value.registrationToken) {
      setPendingGoogleProfile({
        registrationToken: value.registrationToken,
        email: value.email,
        fullName: value.fullName,
        phoneNumber: value.phoneNumber,
        dateOfBirth: value.dateOfBirth,
        gender: value.gender,
      });
      return { requiresProfileCompletion: true };
    }

    throw new Error("Không thể xử lý đăng nhập Google");
  };

  const completeGoogleProfile = async (
    data: Omit<GoogleCompleteProfileRequest, "registrationToken">,
  ) => {
    if (!pendingGoogleProfile?.registrationToken) {
      throw new Error("Thiếu registrationToken cho tài khoản Google");
    }

    const response = await authService.googleCompleteProfile({
      registrationToken: pendingGoogleProfile.registrationToken,
      ...data,
    });

    if (response.isFailure) {
      throw new Error(
        response.error?.description || "Hoàn tất hồ sơ Google thất bại",
      );
    }

    const token = response.value?.token;
    if (!token) {
      throw new Error("Không nhận được token sau khi hoàn tất hồ sơ");
    }

    finalizeLogin(token);
  };

  const signup = async (data: RegisterRequest) => {
    const response = await authService.signup(data);
    if (response.isFailure) {
      throw new Error(response.error?.description || "Đăng ký thất bại");
    }

    setPendingVerification({ email: data.email });
  };

  const verifyEmail = async (email: string, otp: string) => {
    const response = await authService.verifyEmail({ email, otp });
    if (response.isFailure) {
      throw new Error(response.error?.description || "Xác nhận email thất bại");
    }

    const token = response.value?.token;
    if (!token) {
      throw new Error("Không nhận được token xác nhận");
    }

    finalizeLogin(token);
    setPendingVerification(null);
  };

  const logout = () => {
    setUser(null);
    setPendingVerification(null);
    setPendingGoogleProfile(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem("dab_user");
  };

  const clearPendingVerification = () => {
    setPendingVerification(null);
  };

  const clearPendingGoogleProfile = () => {
    setPendingGoogleProfile(null);
  };

  const updateCurrentUser = (patch: Partial<Pick<User, "name" | "avatar">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextUser: User = {
        ...prev,
        ...(patch.name ? { name: patch.name } : {}),
        ...(patch.avatar !== undefined ? { avatar: patch.avatar } : {}),
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
      localStorage.setItem("dab_user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        pendingVerification,
        pendingGoogleProfile,
        login,
        loginWithGoogle,
        completeGoogleProfile,
        logout,
        signup,
        verifyEmail,
        clearPendingVerification,
        clearPendingGoogleProfile,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
