import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileClient from "@/components/profile/ProfileClient";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Ho so ca nhan",
  robots: PRIVATE_ROBOTS,
  alternates: {
    canonical: "/profile",
  },
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
