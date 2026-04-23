import { Metadata } from "next";
import QCInspectionsClient from "@/components/qc/inspections/QCInspectionsClient";

export const metadata: Metadata = {
  title: "Danh sách kiểm định | Design A Bear",
};

export default function QCInspectionsPage() {
  return <QCInspectionsClient />;
}
