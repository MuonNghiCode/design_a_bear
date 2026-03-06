"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ReactNode } from "react";
import CustomScrollbar from "@/components/shared/CustomScrollbar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <CustomScrollbar />
    </AuthProvider>
  );
}
