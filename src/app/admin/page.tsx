import { type Metadata } from "next";
import DashboardClient from "@/components/admin/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Quản trị — Design a Bear",
};

export default function AdminPage() {
  return <DashboardClient />;
}
