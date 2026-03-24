"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotForm from "./ForgotForm";

export type AuthMode = "login" | "register" | "forgot";

export default function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("login");
  const formRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // Fly-up exit → switch → fly-in from below
  const switchMode = useCallback(
    (next: AuthMode) => {
      if (isAnimating.current || mode === next) return;
      isAnimating.current = true;

      if (!formRef.current) {
        setMode(next);
        isAnimating.current = false;
        return;
      }

      const fields =
        formRef.current.querySelectorAll<HTMLElement>(".field-item");

      gsap.to(fields, {
        y: -36,
        opacity: 0,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.in",
        onComplete: () => {
          setMode(next);
        },
      });
    },
    [mode],
  );

  // Fly-in after mode changes
  useEffect(() => {
    if (!formRef.current) return;
    const fields = formRef.current.querySelectorAll<HTMLElement>(".field-item");

    // Reset position before animating in
    gsap.set(fields, { y: 36, opacity: 0 });
    gsap.to(fields, {
      y: 0,
      opacity: 1,
      duration: 0.38,
      stagger: 0.07,
      ease: "power2.out",
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [mode]);

  const cardClassName =
    mode === "register"
      ? "w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#17409A]/10 px-6 md:px-8 py-8 md:py-10 transition-all duration-300"
      : "w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#17409A]/10 px-8 md:px-12 py-10 md:py-12 transition-all duration-300";

  return (
    /* Card: white 70% opacity + blob blur */
    <div className={cardClassName}>
      {/* Bear logo */}
      <div className="flex justify-center mb-6">
        <div className="relative w-20 h-20">
          <Image
            src="/logo.webp"
            alt="Design a Bear"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Animated form area */}
      <div ref={formRef}>
        {mode === "login" && (
          <LoginForm
            onSwitchRegister={() => switchMode("register")}
            onSwitchForgot={() => switchMode("forgot")}
          />
        )}
        {mode === "register" && (
          <RegisterForm onSwitchLogin={() => switchMode("login")} />
        )}
        {mode === "forgot" && (
          <ForgotForm onSwitchLogin={() => switchMode("login")} />
        )}
      </div>
    </div>
  );
}
