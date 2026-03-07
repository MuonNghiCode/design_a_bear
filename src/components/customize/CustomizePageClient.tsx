"use client";

import { useRouter } from "next/navigation";
import ProductCustomize from "./ProductCustomize";

export default function CustomizePageClient() {
  const router = useRouter();

  return (
    <main>
      {/* ── Customize section ── */}
      <ProductCustomize accentColor="#17409A" />
    </main>
  );
}
