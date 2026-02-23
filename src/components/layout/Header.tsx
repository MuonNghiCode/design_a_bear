"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  IoChevronDown,
  IoPersonOutline,
  IoSearchOutline,
  IoHeartOutline,
  IoBagOutline,
  IoCloseOutline,
} from "react-icons/io5";
import gsap from "gsap";

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Header entrance animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );
    }
  }, []);

  useEffect(() => {
    // Dropdown animation
    if (activeDropdown && dropdownRefs.current[activeDropdown]) {
      gsap.fromTo(
        dropdownRefs.current[activeDropdown],
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [activeDropdown]);

  useEffect(() => {
    // Search box animation
    if (searchRef.current && searchButtonRef.current) {
      if (showSearch) {
        // Hide button with smooth fade
        gsap.to(searchButtonRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.25,
          ease: "power2.inOut",
        });

        // Expand search box with smooth curve
        gsap.to(searchRef.current, {
          width: 420,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.15,
        });

        // Focus input after animation
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 500);
      } else {
        // Collapse search box smoothly
        gsap.to(searchRef.current, {
          width: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });

        // Show button back with smooth appear
        gsap.to(searchButtonRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.4)",
          delay: 0.35,
        });
      }
    }
  }, [showSearch]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center md:top-10"
    >
      <div className="max-w-screen-2xl bg-white/70 backdrop-blur-sm rounded-2xl w-full mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <div className="flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("shop")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 transition-colors font-medium">
                Mua sắm
                <IoChevronDown
                  className={`text-base transition-transform duration-300 ${activeDropdown === "shop" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "shop" && (
                <div
                  ref={(el) => {
                    dropdownRefs.current["shop"] = el;
                  }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                >
                  <Link
                    href="/products"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    Tất cả sản phẩm
                  </Link>
                  <Link
                    href="/bears"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    Gấu bông
                  </Link>
                  <Link
                    href="/accessories"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    Phụ kiện
                  </Link>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("collection")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 transition-colors font-medium">
                Bộ sưu tập
                <IoChevronDown
                  className={`text-base transition-transform duration-300 ${activeDropdown === "collection" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "collection" && (
                <div
                  ref={(el) => {
                    dropdownRefs.current["collection"] = el;
                  }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                >
                  <Link
                    href="/collections/spring"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    Bộ sưu tập xuân
                  </Link>
                  <Link
                    href="/collections/summer"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    Bộ sưu tập hè
                  </Link>
                  <Link
                    href="/collections/special"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
                  >
                    Phiên bản đặc biệt
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/story"
              className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
            >
              Câu chuyện
            </Link>

            <Link
              href="/connect"
              className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
            >
              Kết nối
            </Link>
          </div>

          {/* Center Logo */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center justify-center hover:scale-110 transition-transform">
              <Image
                src="/logo.webp"
                alt="Design a Bear Logo"
                width={56}
                height={56}
                className="object-contain w-24 h-24"
              />
            </div>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            <button
              className="text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110"
              aria-label="Tài khoản"
            >
              <IoPersonOutline className="text-2xl" />
            </button>

            {/* Search Section */}
            <div className="flex items-center">
              <div
                ref={searchRef}
                className="overflow-hidden rounded-full"
                style={{ width: 0, opacity: 0 }}
              >
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 whitespace-nowrap">
                  <IoSearchOutline className="text-gray-500 text-xl flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 bg-transparent outline-none ml-3 text-gray-800 placeholder-gray-500 text-sm w-80"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setShowSearch(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => setShowSearch(false)}
                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 p-1 hover:bg-gray-200 rounded-full"
                    aria-label="Đóng"
                  >
                    <IoCloseOutline className="text-xl" />
                  </button>
                </div>
              </div>

              <button
                ref={searchButtonRef}
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110 flex-shrink-0"
                aria-label="Tìm kiếm"
              >
                <IoSearchOutline className="text-2xl" />
              </button>
            </div>

            <button
              className="text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110"
              aria-label="Yêu thích"
            >
              <IoHeartOutline className="text-2xl" />
            </button>

            <button
              className="text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110 relative"
              aria-label="Giỏ hàng"
            >
              <IoBagOutline className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
