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
  IoMenuOutline,
} from "react-icons/io5";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    // Mobile menu animation
    if (mobileMenuRef.current) {
      if (showMobileMenu) {
        gsap.to(mobileMenuRef.current, {
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          x: "-100%",
          duration: 0.4,
          ease: "power2.in",
        });
      }
    }
  }, [showMobileMenu]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center md:top-10"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="max-w-screen-2xl bg-white/70 backdrop-blur-sm rounded-none md:rounded-2xl w-full md:mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile: Hamburger Menu */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-800 hover:text-blue-600 transition-all duration-300"
              aria-label="Menu"
            >
              <IoMenuOutline className="text-3xl" />
            </button>

            {/* Left Navigation - Desktop Only */}
            <div className="hidden md:flex items-center gap-8">
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
                  width={60}
                  height={60}
                  className="object-contain w-14 h-14 md:w-16 md:h-16"
                />
              </div>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Search Section - Desktop Only */}
              <div className="hidden md:flex items-center">
                <div
                  ref={searchRef}
                  className="overflow-hidden rounded-full"
                  style={{ width: 0, opacity: 0 }}
                >
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 whitespace-nowrap">
                    <IoSearchOutline className="text-gray-500 text-xl shrink-0" />
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
                      className="ml-2 text-gray-500 hover:text-gray-700 transition-colors shrink-0 p-1 hover:bg-gray-200 rounded-full"
                      aria-label="Đóng"
                    >
                      <IoCloseOutline className="text-xl" />
                    </button>
                  </div>
                </div>

                <button
                  ref={searchButtonRef}
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110 shrink-0"
                  aria-label="Tìm kiếm"
                >
                  <IoSearchOutline className="text-2xl" />
                </button>
              </div>

              {/* Wishlist - Hidden on small mobile */}
              <button
                className="hidden sm:block text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110"
                aria-label="Yêu thích"
              >
                <IoHeartOutline className="text-2xl" />
              </button>

              {/* Cart - Always visible */}
              <button
                className="text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110 relative"
                aria-label="Giỏ hàng"
              >
                <IoBagOutline className="text-2xl" />
              </button>

              {/* Account / CTA - Far Right */}
              {isAuthenticated ? (
                <button
                  className="text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110"
                  aria-label="Tài khoản"
                >
                  <IoPersonOutline className="text-2xl" />
                </button>
              ) : (
                <Link href="/auth">
                  <button className="hidden sm:block bg-[#17409A] text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#0f2d6e] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                    Mua ngay
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[60] md:hidden shadow-2xl -translate-x-full"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link href="/" onClick={() => setShowMobileMenu(false)}>
            <Image
              src="/logo.webp"
              alt="Design a Bear Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-gray-800 hover:text-blue-600 transition-colors"
            aria-label="Đóng menu"
          >
            <IoCloseOutline className="text-3xl" />
          </button>
        </div>

        {/* Mobile Menu Navigation */}
        <nav className="p-6 space-y-6">
          {/* Shop Section */}
          <div>
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "shop-mobile" ? null : "shop-mobile",
                )
              }
              className="flex items-center justify-between w-full text-gray-800 font-bold text-lg"
            >
              Mua sắm
              <IoChevronDown
                className={`text-xl transition-transform duration-300 ${
                  activeDropdown === "shop-mobile" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeDropdown === "shop-mobile" && (
              <div className="mt-3 ml-4 space-y-3">
                <Link
                  href="/products"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Tất cả sản phẩm
                </Link>
                <Link
                  href="/bears"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Gấu bông
                </Link>
                <Link
                  href="/accessories"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Phụ kiện
                </Link>
              </div>
            )}
          </div>

          {/* Collections Section */}
          <div>
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "collection-mobile"
                    ? null
                    : "collection-mobile",
                )
              }
              className="flex items-center justify-between w-full text-gray-800 font-bold text-lg"
            >
              Bộ sưu tập
              <IoChevronDown
                className={`text-xl transition-transform duration-300 ${
                  activeDropdown === "collection-mobile" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeDropdown === "collection-mobile" && (
              <div className="mt-3 ml-4 space-y-3">
                <Link
                  href="/collections/spring"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Bộ sưu tập xuân
                </Link>
                <Link
                  href="/collections/summer"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Bộ sưu tập hè
                </Link>
                <Link
                  href="/collections/special"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Phiên bản đặc biệt
                </Link>
              </div>
            )}
          </div>

          {/* Other Links */}
          <Link
            href="/story"
            onClick={() => setShowMobileMenu(false)}
            className="block text-gray-800 font-bold text-lg hover:text-blue-600 transition-colors"
          >
            Câu chuyện
          </Link>

          <Link
            href="/connect"
            onClick={() => setShowMobileMenu(false)}
            className="block text-gray-800 font-bold text-lg hover:text-blue-600 transition-colors"
          >
            Kết nối
          </Link>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            {isAuthenticated ? (
              <Link
                href="/account"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 text-gray-800 hover:text-blue-600 transition-colors mb-4"
              >
                <IoPersonOutline className="text-2xl" />
                <span className="font-medium">Tài khoản</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                onClick={() => setShowMobileMenu(false)}
                className="block mb-4"
              >
                <button className="w-full bg-[#17409A] text-white px-6 py-3 rounded-2xl font-bold text-base hover:bg-[#0f2d6e] transition-all duration-300">
                  Mua ngay
                </button>
              </Link>
            )}
            <Link
              href="/wishlist"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <IoHeartOutline className="text-2xl" />
              <span className="font-medium">Yêu thích</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
