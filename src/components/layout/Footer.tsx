"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
  IoArrowForward,
} from "react-icons/io5";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_TEXT = "DESIGN A BEAR";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!footerRef.current) return;

    // ── Wavy letter animation on scroll ──
    const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (letters.length > 0) {
      letters.forEach((letter, i) => {
        // Each letter gets a unique wave phase based on its index
        const waveAmplitude = 28;
        const phase = (i / letters.length) * Math.PI * 2;

        gsap.fromTo(
          letter,
          { y: waveAmplitude * Math.sin(phase) },
          {
            y: -waveAmplitude * Math.sin(phase),
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          },
        );
      });
    }

    // ── Brand text container fade in ──
    if (brandTextRef.current) {
      gsap.fromTo(
        brandTextRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }

    // ── Content stagger ──
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0E2A66] overflow-hidden m-0"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Brand Name Section ── */}
      <div className="relative pt-8 md:pt-16 pb-0 overflow-hidden">
        <div
          ref={brandTextRef}
          className="relative w-full text-center select-none flex items-end justify-center px-4"
          style={{ fontSize: "clamp(2.5rem, 15vw, 14rem)", lineHeight: 1 }}
          aria-label={BRAND_TEXT}
        >
          {BRAND_TEXT.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className="inline-block font-black tracking-tighter text-[#F4F7FF]/10"
              style={{
                // space character needs explicit width
                minWidth: char === " " ? "0.3em" : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Thin divider */}
        <div className="h-px bg-[#F4F7FF]/10 mt-4 md:mt-6" />
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-16">
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24"
        >
          {/* Left — Newsletter */}
          <div className="flex flex-col justify-center max-w-md mx-auto lg:mx-0">
            {/* Logo + name */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[#F4F7FF] font-bold text-lg md:text-xl tracking-wide">
                Design a Bear
              </span>
            </div>

            <p className="text-[#F4F7FF]/60 text-sm mb-4 md:mb-6 leading-relaxed">
              Gấu bông thông minh tích hợp IoT & AI,
              <br className="hidden sm:block" />
              dạy học cho trẻ em theo cách riêng của chúng.
            </p>

            {/* Email input */}
            <form onSubmit={handleSubmit} className="mb-2 md:mb-3">
              <div className="flex items-stretch border border-[#F4F7FF]/25 rounded-xl overflow-hidden hover:border-[#4A90E2]/60 transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Đăng ký nhận tin tức & ưu đãi"
                  required
                  className="flex-1 bg-transparent px-4 md:px-5 py-3 md:py-4 text-[#F4F7FF] placeholder-[#F4F7FF]/35 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#17409A] hover:bg-[#4A90E2] text-white px-4 md:px-5 flex items-center justify-center transition-colors duration-200"
                  aria-label="Đăng ký"
                >
                  <IoArrowForward className="text-lg" />
                </button>
              </div>
            </form>
            <p className="text-[#F4F7FF]/35 text-xs mb-8 md:mb-0">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-[#F4F7FF]/70 transition-colors"
              >
                Điều khoản sử dụng
              </Link>{" "}
              của chúng tôi.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6 md:mt-10 justify-center lg:justify-start">
              {[
                {
                  href: "https://facebook.com",
                  icon: <IoLogoFacebook className="text-lg" />,
                  label: "Facebook",
                },
                {
                  href: "https://instagram.com",
                  icon: <IoLogoInstagram className="text-lg" />,
                  label: "Instagram",
                },
                {
                  href: "https://twitter.com",
                  icon: <IoLogoTwitter className="text-lg" />,
                  label: "Twitter",
                },
                {
                  href: "https://youtube.com",
                  icon: <IoLogoYoutube className="text-lg" />,
                  label: "YouTube",
                },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 md:w-9 md:h-9 rounded-full border border-[#F4F7FF]/20 text-[#F4F7FF]/50 flex items-center justify-center hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Nav Links (3 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-8 lg:gap-12 pt-0 md:pt-2">
            {/* Mua sắm */}
            <div>
              <h4 className="text-[#F4F7FF] font-bold md:font-semibold text-sm tracking-widest uppercase mb-4 md:mb-6">
                Mua sắm
              </h4>
              <ul className="space-y-3 md:space-y-4">
                {[
                  { label: "Tất cả sản phẩm", href: "/products" },
                  { label: "Gấu bông", href: "/bears" },
                  { label: "Phụ kiện", href: "/accessories" },
                  { label: "Bộ sưu tập", href: "/collections" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#F4F7FF]/50 hover:text-[#4A90E2] text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h4 className="text-[#F4F7FF] font-bold md:font-semibold text-sm tracking-widest uppercase mb-4 md:mb-6">
                Hỗ trợ
              </h4>
              <ul className="space-y-3 md:space-y-4">
                {[
                  { label: "Câu hỏi thường gặp", href: "/faq" },
                  { label: "Vận chuyển", href: "/shipping" },
                  { label: "Đổi trả", href: "/returns" },
                  { label: "Bảo hành", href: "/warranty" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#F4F7FF]/50 hover:text-[#4A90E2] text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Về chúng tôi */}
            <div>
              <h4 className="text-[#F4F7FF] font-bold md:font-semibold text-sm tracking-widest uppercase mb-4 md:mb-6">
                Về chúng tôi
              </h4>
              <ul className="space-y-3 md:space-y-4">
                {[
                  { label: "Câu chuyện", href: "/story" },
                  { label: "Kết nối IoT", href: "/connect" },
                  {
                    label: "Instagram",
                    href: "https://instagram.com",
                    external: true,
                  },
                  {
                    label: "YouTube",
                    href: "https://youtube.com",
                    external: true,
                  },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-[#F4F7FF]/50 hover:text-[#4A90E2] text-sm transition-colors duration-200 flex items-center gap-1"
                    >
                      {item.label}
                      {item.external && (
                        <span className="text-[#F4F7FF]/25 text-xs">↗</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#F4F7FF]/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-5 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-[#F4F7FF]/35 text-xs md:text-sm text-center sm:text-left">
            ©2026 Design a Bear. All rights reserved.
          </p>
          <div className="flex gap-6 md:gap-8">
            <Link
              href="/privacy"
              className="text-[#F4F7FF]/35 hover:text-[#F4F7FF]/70 text-xs md:text-sm transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/terms"
              className="text-[#F4F7FF]/35 hover:text-[#F4F7FF]/70 text-xs md:text-sm transition-colors"
            >
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
