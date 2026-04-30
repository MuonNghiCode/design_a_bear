"use client";

import { useParams } from "next/navigation";
import PromotionEditView from "@/components/admin/promotions/PromotionEditView";

export default function AdminPromotionEditPage() {
  const params = useParams();
  const id = params.id as string;

  return <PromotionEditView id={id} />;
}
