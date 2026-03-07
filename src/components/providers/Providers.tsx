"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { ReactNode } from "react";
import CustomScrollbar from "@/components/shared/CustomScrollbar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <CustomScrollbar />
      </CartProvider>
    </AuthProvider>
  );
}
