"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StoryHero from "./StoryHero";
import StoryTimeline from "./StoryTimeline";
import StoryValues from "./StoryValues";
import StoryPromise from "./StoryPromise";
import StoryDivider from "./StoryDivider";

gsap.registerPlugin(ScrollTrigger);

export default function StoryClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".story-panel");
      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: isMobile ? 14 : 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isMobile ? 0.45 : 0.55,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: panel,
              start: isMobile ? "top 92%" : "top 86%",
              once: true,
            },
          },
        );
      });

      const chapterTitles = gsap.utils.toArray<HTMLElement>(
        ".story-chapter-title",
      );
      chapterTitles.forEach((title) => {
        gsap.fromTo(
          title,
          { autoAlpha: 0, y: isMobile ? 16 : 24, letterSpacing: "0.08em" },
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: "0em",
            duration: isMobile ? 0.48 : 0.6,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: title,
              start: isMobile ? "top 93%" : "top 88%",
              once: true,
            },
          },
        );
      });

      const lines = gsap.utils.toArray<HTMLElement>(".story-reveal-line");
      lines.forEach((line) => {
        const triggerEl = line.closest(
          ".story-reveal-wrap",
        ) as HTMLElement | null;
        gsap.fromTo(
          line,
          { yPercent: 120, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: triggerEl ?? line,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      const phraseGroups = gsap.utils.toArray<HTMLElement>(
        ".story-phrase-group",
      );
      phraseGroups.forEach((group) => {
        const phrases = group.querySelectorAll(".story-phrase");
        gsap.fromTo(
          phrases,
          { yPercent: isMobile ? 105 : 120, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: isMobile ? 0.46 : 0.56,
            stagger: isMobile ? 0.045 : 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: group,
              start: isMobile ? "top 94%" : "top 88%",
              once: true,
            },
          },
        );
      });

      const leftScenes = gsap.utils.toArray<HTMLElement>(".story-scene-left");
      leftScenes.forEach((scene) => {
        gsap.fromTo(
          scene,
          isMobile ? { autoAlpha: 0, y: 16 } : { autoAlpha: 0, x: -24 },
          {
            autoAlpha: 1,
            ...(isMobile ? { y: 0 } : { x: 0 }),
            duration: isMobile ? 0.45 : 0.55,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: scene,
              start: isMobile ? "top 92%" : "top 82%",
              once: true,
            },
          },
        );
      });

      const rightScenes = gsap.utils.toArray<HTMLElement>(".story-scene-right");
      rightScenes.forEach((scene) => {
        gsap.fromTo(
          scene,
          isMobile ? { autoAlpha: 0, y: 16 } : { autoAlpha: 0, x: 24 },
          {
            autoAlpha: 1,
            ...(isMobile ? { y: 0 } : { x: 0 }),
            duration: isMobile ? 0.45 : 0.55,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: scene,
              start: isMobile ? "top 92%" : "top 82%",
              once: true,
            },
          },
        );
      });

      const watermarks = gsap.utils.toArray<HTMLElement>(".story-watermark");
      watermarks.forEach((mark) => {
        const section = mark.closest("section") as HTMLElement | null;
        gsap.fromTo(
          mark,
          { y: -10, autoAlpha: 0.05 },
          {
            y: 14,
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

      <div id="story-ch1">
        <StoryHero />
      </div>
      <StoryDivider from="#F4F7FF" to="#FFFFFF" />

      <div id="story-ch2">
        <StoryTimeline />
      </div>
      <StoryDivider from="#FFFFFF" to="#F4F7FF" />

      <div id="story-ch3">
        <StoryValues />
      </div>
      <StoryDivider from="#F4F7FF" to="#FFFFFF" />

      <div id="story-ch4">
        <StoryPromise />
      </div>
      <Footer />
    </div>
  );
}
