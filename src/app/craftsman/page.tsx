import CraftsmanDashboardClient from "@/components/craftsman/dashboard/CraftsmanDashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng điều khiển thợ thủ công | Design a Bear",
  description: "Quản lý công việc và thu nhập của thợ thủ công",
};

export default function CraftsmanDashboardPage() {
  return <CraftsmanDashboardClient />;
}
