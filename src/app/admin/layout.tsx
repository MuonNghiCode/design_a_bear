import { type ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminPreferencesProvider } from "@/contexts/AdminPreferencesContext";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminPreferencesProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminPreferencesProvider>
  );
}
