import type { Metadata } from "next";
import ConnectClient from "@/components/connect/ConnectClient";

export const metadata: Metadata = {
  title: "Kết nối - Design a Bear",
};

export default function ConnectPage() {
  return <ConnectClient />;
}
