import { type ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminPreferencesProvider } from "@/contexts/AdminPreferencesContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị — Design a Bear",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminPreferencesProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminPreferencesProvider>
  );
}
