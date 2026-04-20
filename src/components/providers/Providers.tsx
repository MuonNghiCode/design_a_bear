"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { FavoriteProvider } from "@/contexts/FavoriteContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { ReactNode } from "react";
import CustomScrollbar from "@/components/shared/CustomScrollbar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <FavoriteProvider>
            {children}
            <CartDrawer />
            <CustomScrollbar />
          </FavoriteProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
