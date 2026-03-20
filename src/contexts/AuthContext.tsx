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
import type { RegisterRequest } from "@/types";

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: RegisterRequest) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  clearPendingVerification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

type JwtPayload = {
  id?: string;
  email?: string;
  fullname?: string;
  [ROLE_CLAIM]?: string;
  role?: string;
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

function mapRole(rawRole?: string): UserRole {
  if (!rawRole) return "user";
  if (rawRole === "1" || rawRole.toLowerCase() === "admin") return "admin";
  if (rawRole === "2" || rawRole.toLowerCase() === "staff") return "staff";
  return "user";
}

function buildUserFromToken(token: string): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const roleValue = payload[ROLE_CLAIM] ?? payload.role;
  const email = payload.email ?? "";
  const id = payload.id ?? email;
  if (!id || !email) return null;

  return {
    id,
    email,
    name: payload.fullname ?? email,
    role: mapRole(roleValue),
    avatar: "/teddy_bear.png",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<{
    email: string;
  } | null>(null);

  useEffect(() => {
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

    const parsedUser = buildUserFromToken(token);
    if (!parsedUser) {
      throw new Error("Không thể đọc thông tin người dùng từ token");
    }

    setUser(parsedUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
    localStorage.setItem("dab_user", JSON.stringify(parsedUser));
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

    const parsedUser = buildUserFromToken(token);
    if (!parsedUser) {
      throw new Error("Không thể đọc thông tin người dùng từ token");
    }

    setUser(parsedUser);
    setPendingVerification(null);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
    localStorage.setItem("dab_user", JSON.stringify(parsedUser));
  };

  const logout = () => {
    setUser(null);
    setPendingVerification(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem("dab_user");
  };

  const clearPendingVerification = () => {
    setPendingVerification(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        pendingVerification,
        login,
        logout,
        signup,
        verifyEmail,
        clearPendingVerification,
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
