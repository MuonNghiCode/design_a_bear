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
import { userService } from "@/services/user.service";
import { useToast } from "@/contexts/ToastContext";
import type {
  GoogleCompleteProfileRequest,
  GoogleLoginResponseData,
  RegisterRequest,
} from "@/types";

export type UserRole =
  | "admin"
  | "staff"
  | "customer"
  | "craftsman"
  | "quality_control";

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
const ID_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

type JwtPayload = {
  id?: string;
  userId?: string;
  sub?: string;
  [ID_CLAIM]?: string;
  nameid?: string;
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
  if (!rawRole && !roleName) return "customer";

  const roleValue = rawRole !== undefined ? String(rawRole).toLowerCase() : "";
  const nameValue = roleName ? roleName.toLowerCase() : "";

  if (roleValue === "1" || roleValue === "admin" || nameValue === "admin")
    return "admin";
  if (roleValue === "2" || roleValue === "staff" || nameValue === "staff")
    return "staff";
  if (
    roleValue === "4" ||
    roleValue === "craftsman" ||
    nameValue === "craftsman"
  )
    return "craftsman";
  if (
    roleValue === "5" ||
    roleValue === "qualitycontrol" ||
    roleValue === "quality_control" ||
    nameValue === "qualitycontrol" ||
    nameValue === "quality_control"
  )
    return "quality_control";

  return "customer";
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
  // Ưu tiên các mã định danh UUID (userId, sub, nameidentifier) trước 'id' (vốn có thể là email)
  const id =
    payload.userId ??
    payload.sub ??
    payload[ID_CLAIM] ??
    payload.nameid ??
    payload.id ??
    email;

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
}

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

  const finalizeLogin = async (token: string) => {
    // 1. Save token first so subsequent API calls (like getProfile) can use it
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);

    try {
      // Set session as valid so it's not cleared on entry within same tab
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dab_session_valid", "true");
      }

      // 2. Fetch full profile to get the real UUID (userId)
      const profileResponse = await userService.getProfile();

      if (profileResponse.isFailure) {
        throw new Error(
          profileResponse.error?.description || "Không thể lấy thông tin hồ sơ",
        );
      }

      const profile = profileResponse.value;
      const parsedUserFromToken = buildUserFromToken(token);

      if (!parsedUserFromToken) {
        throw new Error("Không thể đọc thông tin từ token");
      }

      // 3. Merge token data with real profile data (especially the UUID)
      const finalUser: User = {
        ...parsedUserFromToken,
        id: profile.userId, // Use the real UUID from BE profile
        name: profile.fullName || parsedUserFromToken.name,
        avatar: profile.avatarUrl || parsedUserFromToken.avatar,
      };

      setUser(finalUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(finalUser));
      localStorage.setItem("dab_user", JSON.stringify(finalUser));
      setPendingGoogleProfile(null);
    } catch (error) {
      console.error("[Auth] finalizeLogin error:", error);
      // Fallback: if getProfile fails, use token data but it might lead to 401s later
      const parsedUser = buildUserFromToken(token);
      if (parsedUser) {
        setUser(parsedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
        localStorage.setItem("dab_user", JSON.stringify(parsedUser));
      }
      setPendingGoogleProfile(null);
    }
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

    const rememberMe = localStorage.getItem("dab_remember_me");
    const sessionValid = sessionStorage.getItem("dab_session_valid");

    if (rememberMe !== "true" && sessionValid !== "true") {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem("dab_user");
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }

    const storedUser =
      localStorage.getItem(STORAGE_KEYS.USER) ??
      localStorage.getItem("dab_user");
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem("dab_user");
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    } else {
      setUser(null);
      if (storedUser || token) {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem("dab_user");
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
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

    await finalizeLogin(token);
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
      await finalizeLogin(value.token);
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

    await finalizeLogin(token);
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

    await finalizeLogin(token);
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
