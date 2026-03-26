import type { Metadata } from "next";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthFormPanel from "@/components/auth/AuthFormPanel";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Dang nhap va dang ky",
  description: "Trang dang nhap va tao tai khoan Design a Bear.",
  robots: PRIVATE_ROBOTS,
  alternates: {
    canonical: "/auth",
  },
};

export default function AuthPage() {
  return (
    <div className="h-screen overflow-hidden relative flex">
      <AuthBackground />
      <AuthBrandPanel />
      <AuthFormPanel />
    </div>
  );
}
