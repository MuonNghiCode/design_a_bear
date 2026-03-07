"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useCart } from "@/contexts/CartContext";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmarkCircle,
  IoLockClosedOutline,
} from "react-icons/io5";
import { PawPrint, fmt } from "./checkout.atoms";
import { FREE_SHIP, deliverySchema } from "./checkout.config";
import type { DeliveryForm } from "./checkout.types";
import { StepTracker } from "./StepTracker";
import { StepDelivery } from "./StepDelivery";
import { StepPayment } from "./StepPayment";
import { StepConfirm } from "./StepConfirm";
import { SuccessScreen } from "./SuccessScreen";
import { OrderSummary } from "./OrderSummary";
import Image from "next/image";

/*  Main Component */
export default function CheckoutClient() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DeliveryForm>({
    name: "",
    phone: "",
    email: "",
    province: "",
    provinceName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
    address: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showDeliveryErrors, setShowDeliveryErrors] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(
    () => "DAB" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { totalPrice, clearCart, totalItems } = useCart();

  const SHIPPING_FEE = totalPrice >= FREE_SHIP ? 0 : 30_000;
  const DISCOUNT = couponApplied ? 50_000 : 0;
  const FINAL_TOTAL = totalPrice + SHIPPING_FEE - DISCOUNT;

  /*  Step transitions  */
  const transition = useCallback((nextStep: number, direction: 1 | -1) => {
    gsap.to(contentRef.current, {
      x: direction * -40,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        setStep(nextStep);
        gsap.fromTo(
          contentRef.current,
          { x: direction * 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.38, ease: "power3.out" },
        );
      },
    });
  }, []);

  const goNext = useCallback(() => {
    if (step === 1) {
      const result = deliverySchema.safeParse({
        name: form.name,
        phone: form.phone,
        email: form.email,
        province: form.province,
        district: form.district,
        ward: form.ward,
        address: form.address,
      });
      if (!result.success) {
        setShowDeliveryErrors(true);
        return;
      }
      setShowDeliveryErrors(false);
    }
    if (step < 3) transition(step + 1, 1);
    else {
      // Place order
      gsap.to(contentRef.current, {
        scale: 0.96,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setOrderPlaced(true);
          clearCart();
          gsap.fromTo(
            contentRef.current,
            { scale: 0.96, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.2)" },
          );
        },
      });
    }
  }, [step, form, transition, clearCart]);

  const goBack = useCallback(() => {
    if (step > 1) transition(step - 1, -1);
    else router.back();
  }, [step, transition, router]);

  /*  Entrance animation  */
  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.15 },
    );
  }, []);

  /* Empty cart redirect */
  if (totalItems === 0 && !orderPlaced) {
    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col gap-5"
        style={{
          fontFamily: "'Nunito', sans-serif",
          backgroundColor: "#F4F7FF",
        }}
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: "#E8EDF7" }}
        >
          <PawPrint color="#17409A" size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black mb-1" style={{ color: "#1A1A2E" }}>
            Giỏ hàng trống
          </h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Hãy thêm sản phẩm trước khi thanh toán nhé!
          </p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105"
          style={{ backgroundColor: "#17409A" }}
        >
          <IoArrowBack />
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        fontFamily: "'Nunito', sans-serif",
        backgroundColor: "#F4F7FF",
      }}
    >
      {/*  LEFT PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mini nav header  */}
        <header
          className="px-8 py-5 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid #E5E7EB" }}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: "#17409A" }}
            >
              <Image
                src="/logo.webp"
                alt="Design a Bear Logo"
                width={60}
                height={60}
                className="object-contain w-14 h-14 md:w-16 md:h-16"
              />
            </div>
            <span
              className="font-black text-base"
              style={{ color: "#17409A", fontFamily: "'Nunito', sans-serif" }}
            >
              Design a Bear
            </span>
          </Link>

          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#9CA3AF" }}
          >
            <IoLockClosedOutline />
            <span>Thanh toán an toàn & bảo mật</span>
          </div>
        </header>

        {/*  Scrollable content  */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {/* Page title */}
            {!orderPlaced && (
              <div className="mb-8">
                <h1
                  className="text-3xl font-black mb-1"
                  style={{
                    color: "#1A1A2E",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Hoàn tất đơn hàng
                </h1>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 w-12 rounded-full"
                    style={{ backgroundColor: "#17409A" }}
                  />
                  <div
                    className="h-1 w-6 rounded-full"
                    style={{ backgroundColor: "#FF6B9D" }}
                  />
                  <div
                    className="h-1 w-3 rounded-full"
                    style={{ backgroundColor: "#4ECDC4" }}
                  />
                </div>
              </div>
            )}

            {/* Step tracker */}
            {!orderPlaced && <StepTracker current={step} />}

            {/* Step content */}
            <div ref={contentRef} className="relative">
              {orderPlaced ? (
                <SuccessScreen orderId={orderId} />
              ) : (
                <>
                  {step === 1 && (
                    <StepDelivery
                      form={form}
                      onChange={setForm}
                      showErrors={showDeliveryErrors}
                    />
                  )}
                  {step === 2 && (
                    <StepPayment
                      method={paymentMethod}
                      onChange={setPaymentMethod}
                    />
                  )}
                  {step === 3 && (
                    <StepConfirm
                      form={form}
                      method={paymentMethod}
                      agreed={agreed}
                      setAgreed={setAgreed}
                    />
                  )}
                </>
              )}
            </div>

            {/* Navigation buttons  */}
            {!orderPlaced && (
              <div
                className="flex items-center justify-between mt-10 pt-6"
                style={{ borderTop: "1px solid #E5E7EB" }}
              >
                {/* Back */}
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#F4F7FF",
                    color: "#6B7280",
                    border: "2px solid #E5E7EB",
                  }}
                >
                  <IoArrowBack className="text-base" />
                  {step === 1 ? "Giỏ hàng" : "Quay lại"}
                </button>

                {/* Next / Submit */}
                <button
                  onClick={goNext}
                  disabled={step === 3 && !agreed}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-black text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background:
                      step === 3 && !agreed
                        ? "#D1D5DB"
                        : "linear-gradient(135deg, #17409A 0%, #0E2A66 100%)",
                    boxShadow:
                      step === 3 && !agreed
                        ? "none"
                        : "0 6px 20px rgba(23,64,154,0.35)",
                  }}
                >
                  {step < 3 ? (
                    <>
                      Tiếp theo
                      <IoArrowForward className="text-base" />
                    </>
                  ) : (
                    <>
                      Đặt hàng ngay
                      <IoCheckmarkCircle className="text-base" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL â€” Order Summary*/}
      <div
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{ width: 400 }}
      >
        <OrderSummary
          shippingFee={SHIPPING_FEE}
          discount={DISCOUNT}
          finalTotal={FINAL_TOTAL}
          coupon={coupon}
          onCouponChange={setCoupon}
          onApplyCoupon={() => setCouponApplied(true)}
          couponApplied={couponApplied}
          step={step}
        />
      </div>

      {/* MOBILE: Bottom bar */}
      {!orderPlaced && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between z-50"
          style={{
            backgroundColor: "#0E2A66",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Tổng cộng
            </p>
            <p className="text-lg font-black" style={{ color: "white" }}>
              {fmt(FINAL_TOTAL)}
            </p>
          </div>
          <button
            onClick={goNext}
            disabled={step === 3 && !agreed}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-white transition-all duration-200 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #17409A 0%, #4ECDC4 100%)",
            }}
          >
            {step < 3 ? "Tiếp theo" : "Đặt hàng"}
            <IoArrowForward className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
