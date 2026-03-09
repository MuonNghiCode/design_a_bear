"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// ── Mock accounts ─────────────────────────────────────────────────────────
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin Gấu Bông",
    email: "admin@designabear.vn",
    password: "admin123",
    role: "admin",
    avatar: "/teddy_bear.png",
  },
  {
    id: "2",
    name: "Nhân viên Bông",
    email: "staff@designabear.vn",
    password: "staff123",
    role: "staff",
    avatar: "/teddy_bear.png",
  },
  {
    id: "3",
    name: "Người dùng",
    email: "user@designabear.vn",
    password: "user123",
    role: "user",
    avatar: "/teddy_bear.png",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dab_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("dab_user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("dab_user", JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dab_user");
  };

  const register = async (name: string, email: string, _password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "user",
      avatar: "/teddy_bear.png",
    };
    setUser(newUser);
    localStorage.setItem("dab_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
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
