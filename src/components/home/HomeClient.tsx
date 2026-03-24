"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import Collections from "@/components/home/Collections";
import Testimonials from "@/components/home/Testimonials";

export default function HomeClient() {
  return (
    <>
      <Header />
      <HeroSection />
      <HowItWorks />
      <Collections />
      <Testimonials />
      <Footer />
    </>
  );
}
