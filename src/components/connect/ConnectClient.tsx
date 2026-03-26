"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConnectHero from "./ConnectHero";
import ConnectWays from "./ConnectWays";
import ConnectCommunity from "./ConnectCommunity";
import ConnectWorkshops from "./ConnectWorkshops";
import ConnectFormSection from "./ConnectFormSection";
import ConnectDivider from "./ConnectDivider";

gsap.registerPlugin(ScrollTrigger);

export default function ConnectClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".connect-ac");
      cards.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: isMobile ? 16 : 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isMobile ? 0.45 : 0.55,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 94%" : "top 86%",
              once: true,
            },
          },
        );
      });

      const reveals = gsap.utils.toArray<HTMLElement>(".connect-reveal");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: isMobile ? 14 : 20, letterSpacing: "0.04em" },
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: "0em",
            duration: isMobile ? 0.42 : 0.58,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 95%" : "top 89%",
              once: true,
            },
          },
        );
      });

      const chapterTitles = gsap.utils.toArray<HTMLElement>(
        ".connect-chapter-title",
      );
      chapterTitles.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: isMobile ? 14 : 22, letterSpacing: "0.06em" },
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: "0em",
            duration: isMobile ? 0.45 : 0.6,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 95%" : "top 90%",
              once: true,
            },
          },
        );
      });

      const phraseGroups = gsap.utils.toArray<HTMLElement>(
        ".connect-phrase-group",
      );
      phraseGroups.forEach((group) => {
        const phrases = group.querySelectorAll(".connect-phrase");
        gsap.fromTo(
          phrases,
          { yPercent: isMobile ? 105 : 120, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: isMobile ? 0.45 : 0.56,
            stagger: isMobile ? 0.045 : 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: group,
              start: isMobile ? "top 95%" : "top 89%",
              once: true,
            },
          },
        );
      });

      const watermarks = gsap.utils.toArray<HTMLElement>(".connect-watermark");
      watermarks.forEach((mark) => {
        const section = mark.closest("section") as HTMLElement | null;
        gsap.fromTo(
          mark,
          { y: -10, autoAlpha: 0.05 },
          {
            y: 12,
            autoAlpha: 0.11,
            ease: "none",
            scrollTrigger: {
              trigger: section ?? mark,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-screen bg-[#F4F7FF]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <Header />
      <ConnectHero />
      <ConnectDivider from="#F4F7FF" to="#FFFFFF" />
      <ConnectWays />
      <ConnectDivider from="#FFFFFF" to="#F4F7FF" />
      <ConnectCommunity />
      <ConnectDivider from="#F4F7FF" to="#FFFFFF" />
      <ConnectWorkshops />
      <ConnectDivider from="#FFFFFF" to="#F4F7FF" />
      <ConnectFormSection />
      <Footer />
    </div>
  );
}
