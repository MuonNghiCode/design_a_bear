"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { ReactNode } from "react";
import CustomScrollbar from "@/components/shared/CustomScrollbar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <CartDrawer />
          <CustomScrollbar />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
