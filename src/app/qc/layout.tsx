import { Metadata } from "next";
import QCLayout from "@/components/qc/QCLayout";

export const metadata: Metadata = {
  title: "QC Dashboard | Design A Bear",
  description: "Quality Control Dashboard for Design A Bear",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <QCLayout>{children}</QCLayout>;
}
