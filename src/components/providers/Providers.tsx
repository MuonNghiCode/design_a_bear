"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { FavoriteProvider } from "@/contexts/FavoriteContext";
import CartDrawer from "@/components/cart/CartDrawer";
import FavoriteDrawer from "@/components/cart/FavoriteDrawer";
import { ReactNode } from "react";
import CustomScrollbar from "@/components/shared/CustomScrollbar";
import RoleGuard from "@/components/providers/RoleGuard";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <RoleGuard>
          <CartProvider>
            <FavoriteProvider>
              {children}
              <CartDrawer />
              <FavoriteDrawer />
              <CustomScrollbar />
            </FavoriteProvider>
          </CartProvider>
        </RoleGuard>
      </AuthProvider>
    </ToastProvider>
  );
}
