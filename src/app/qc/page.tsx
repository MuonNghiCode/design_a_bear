import { Metadata } from "next";
import QCDashboardClient from "@/components/qc/dashboard/QCDashboardClient";

export const metadata: Metadata = {
  title: "QC Dashboard | Design A Bear",
};

export default function QCPage() {
  return <QCDashboardClient />;
}
