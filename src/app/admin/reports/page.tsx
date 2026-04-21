import RevenueReportClient from "@/components/admin/reports/RevenueReportClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Báo cáo doanh thu | Design a Bear Admin",
  description: "Báo cáo chi tiết doanh thu và lợi nhuận bán hàng.",
};

export default function ReportsPage() {
  return <RevenueReportClient />;
}
