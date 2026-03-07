"use client";

import { useEffect, useState } from "react";
import LoadingIntro from "@/components/home/LoadingIntro";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Collections from "@/components/home/Collections";
import Testimonials from "@/components/home/Testimonials";

export default function HomeClient() {
  const [introVisible, setIntroVisible] = useState(true);

  // Force scroll to top immediately on every page load/refresh
  useEffect(() => {
    // Disable browser scroll restoration so it doesn't jump to a previous position
    if (typeof history !== "undefined") {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleIntroComplete = () => {
    // Ensure we're at the very top before revealing hero
    window.scrollTo({ top: 0, behavior: "instant" });
    setIntroVisible(false);
  };

  return (
    <>
      {/* Loading intro — slides up on complete */}
      {introVisible && <LoadingIntro onComplete={handleIntroComplete} />}

      {/* Main page content */}
      <Header hideOnHero />
      <HeroSection />
      <FeaturedProducts />
      <HowItWorks />
      <Collections />
      <Testimonials />
      <Footer />
    </>
  );
}
