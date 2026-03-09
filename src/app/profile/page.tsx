import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
  title: "Hồ sơ — Design a Bear",
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ProfileClient />
      </Suspense>
      <Footer />
    </>
  );
}
