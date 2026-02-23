"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoArrowForward,
} from "react-icons/io5";
import { GiBearFace } from "react-icons/gi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bearsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (footerRef.current) {
      // Hero text animation
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current,
          { y: 100, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          },
        );
      }

      // Text wave effect on scroll
      textRefs.current.forEach((text, index) => {
        if (text) {
          gsap.fromTo(
            text,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: text,
                start: "top 90%",
                end: "top 70%",
                scrub: 1,
              },
              delay: index * 0.1,
            },
          );
        }
      });

      // Simple fade in for bears
      bearsRef.current.forEach((bear) => {
        if (bear) {
          gsap.fromTo(
            bear,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 70%",
                end: "top 40%",
                scrub: 1,
              },
            },
          );
        }
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer
      ref={footerRef}
      className="relative min-h-screen bg-[#F4F7FF] overflow-hidden"
    >
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#17409A]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4A90E2]/5 rounded-full blur-3xl"></div>

      {/* Hero Text Section - Full Width DESIGN A BEAR */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-32 pb-20">
        <div className="w-full text-center overflow-hidden">
          <h1
            ref={heroTextRef}
            className="text-[clamp(3rem,15vw,12rem)] font-black leading-none tracking-tight whitespace-nowrap bg-gradient-to-r from-[#17409A] via-[#4A90E2] to-[#17409A] bg-clip-text text-transparent"
            style={{
              textShadow: "0 4px 20px rgba(23, 64, 154, 0.15)",
            }}
          >
            DESIGN A BEAR
          </h1>
          <div className="mt-8 w-32 h-1 bg-gradient-to-r from-[#17409A] to-[#4A90E2] mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 relative z-10 flex flex-col justify-center min-h-screen py-32">
        {/* Spacer for hero text */}
        <div className="mb-32 h-48"></div>

        {/* Newsletter Section */}
        <div className="mb-32 max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2
              ref={(el) => {
                textRefs.current[0] = el;
              }}
              className="text-4xl md:text-5xl font-bold text-[#17409A] mb-6"
            >
              Nhận tin tức mới nhất
            </h2>
            <p
              ref={(el) => {
                textRefs.current[1] = el;
              }}
              className="text-gray-600 text-xl max-w-2xl mx-auto"
            >
              Đăng ký để nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-5 max-w-3xl mx-auto"
          >
            <div className="relative flex-1">
              <IoMailOutline className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-gray-300 focus:border-[#17409A] focus:outline-none transition-all text-gray-800 text-lg shadow-lg hover:shadow-xl bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#17409A] to-[#4A90E2] text-white px-12 py-5 rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 font-bold shadow-xl hover:scale-[1.02] group text-lg whitespace-nowrap"
            >
              <span>Đăng ký ngay</span>
              <IoArrowForward className="group-hover:translate-x-1 transition-transform text-2xl" />
            </button>
          </form>
        </div>

        {/* Separator Line */}
        <div className="mb-20">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Footer Links */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* About Section */}
            <div
              ref={(el) => {
                textRefs.current[2] = el;
              }}
            >
              <div className="mb-8">
                <Image
                  src="/logo.webp"
                  alt="Design a Bear Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold mb-5 text-gray-900">
                Design a Bear
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Gấu bông thông minh tích hợp IoT và AI, mang đến trải nghiệm học
                tập độc đáo và sáng tạo cho trẻ em.
              </p>
            </div>

            {/* Quick Links */}
            <div
              ref={(el) => {
                textRefs.current[3] = el;
              }}
            >
              <h3 className="text-xl font-bold mb-8 text-gray-900">
                Liên kết nhanh
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/products"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Mua sắm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Bộ sưu tập
                  </Link>
                </li>
                <li>
                  <Link
                    href="/story"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Câu chuyện
                  </Link>
                </li>
                <li>
                  <Link
                    href="/connect"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Kết nối
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div
              ref={(el) => {
                textRefs.current[4] = el;
              }}
            >
              <h3 className="text-xl font-bold mb-8 text-gray-900">Hỗ trợ</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Vận chuyển
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Đổi trả
                  </Link>
                </li>
                <li>
                  <Link
                    href="/warranty"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base flex items-center gap-3 group font-medium"
                  >
                    <GiBearFace className="text-xl group-hover:scale-110 transition-transform" />{" "}
                    Bảo hành
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div
              ref={(el) => {
                textRefs.current[5] = el;
              }}
            >
              <h3 className="text-xl font-bold mb-8 text-gray-900">Liên hệ</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <IoLocationOutline className="text-[#17409A] text-2xl flex-shrink-0 mt-1" />
                  <span className="text-gray-600 text-base font-medium">
                    Khu Công Nghệ Cao, Quận 9, TP.HCM
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <IoCallOutline className="text-[#17409A] text-2xl flex-shrink-0" />
                  <a
                    href="tel:+84123456789"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base font-medium"
                  >
                    +84 123 456 789
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <IoMailOutline className="text-[#17409A] text-2xl flex-shrink-0" />
                  <a
                    href="mailto:info@designabear.vn"
                    className="text-gray-600 hover:text-[#17409A] transition-colors text-base font-medium"
                  >
                    info@designabear.vn
                  </a>
                </li>
              </ul>

              {/* Social Media */}
              <div className="flex gap-4 mt-8">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#17409A]/10 hover:bg-[#17409A] text-[#17409A] hover:text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                >
                  <IoLogoFacebook className="text-2xl" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#17409A]/10 hover:bg-[#17409A] text-[#17409A] hover:text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                >
                  <IoLogoInstagram className="text-2xl" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#17409A]/10 hover:bg-[#17409A] text-[#17409A] hover:text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                >
                  <IoLogoTwitter className="text-2xl" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#17409A]/10 hover:bg-[#17409A] text-[#17409A] hover:text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                >
                  <IoLogoYoutube className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-300/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-base font-medium">
              © 2026 Design a Bear. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-[#17409A] transition-colors text-base font-medium hover:underline underline-offset-4"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-[#17409A] transition-colors text-base font-medium hover:underline underline-offset-4"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
