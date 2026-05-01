import type { Metadata } from "next";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthFormPanel from "@/components/auth/AuthFormPanel";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Đăng nhập và Đăng ký",
  description: "Trang đăng nhập và tạo tài khoản Design a Bear.",
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
