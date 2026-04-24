import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CollectionsHero from "@/components/collections/CollectionsHero";
import CollectionsGrid from "@/components/collections/CollectionsGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bộ Sưu Tập | Design a Bear",
  description: "Khám phá các bộ sưu tập gấu bông thông minh độc đáo tại Design a Bear.",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CollectionsHero />
      <CollectionsGrid />
      <Footer />
    </main>
  );
}
