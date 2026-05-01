import { Metadata } from "next";
import QCLayout from "@/components/qc/QCLayout";

export const metadata: Metadata = {
  title: "Bảng điều khiển QC | Design A Bear",
  description: "Bảng điều khiển quản lý chất lượng dành cho Design A Bear",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <QCLayout>{children}</QCLayout>;
}
