import { type ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminPreferencesProvider } from "@/contexts/AdminPreferencesContext";
import { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Quản trị | Design A Bear",
  robots: PRIVATE_ROBOTS,
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminPreferencesProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminPreferencesProvider>
  );
}
