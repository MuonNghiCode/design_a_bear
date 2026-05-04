import { type ReactNode } from "react";
import { Metadata } from "next";
import StaffLayout from "@/components/staff/StaffLayout";
import { AdminPreferencesProvider } from "@/contexts/AdminPreferencesContext";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Cổng thông tin nhân viên | Design A Bear",
  robots: PRIVATE_ROBOTS,
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminPreferencesProvider>
      <StaffLayout>{children}</StaffLayout>
    </AdminPreferencesProvider>
  );
}
