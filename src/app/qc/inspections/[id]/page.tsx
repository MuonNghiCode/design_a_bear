import QCInspectionDetailClient from "@/components/qc/inspections/QCInspectionDetailClient";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Chi tiết kiểm định | Design A Bear",
};

export default async function QCInspectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QCInspectionDetailClient jobId={id} />;
}
