"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SettingsProfileHero from "@/components/admin/settings/SettingsProfileHero";
import SettingsStore from "@/components/admin/settings/SettingsStore";
import SettingsNotifications from "@/components/admin/settings/SettingsNotifications";
import SettingsSecurity from "@/components/admin/settings/SettingsSecurity";
import SettingsAppearance from "@/components/admin/settings/SettingsAppearance";

export default function SettingsClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-5">
      {/* Page title */}
      <div className="ac">
        <h1 className="text-[#1A1A2E] font-black text-2xl">Cài đặt</h1>
        <p className="text-[#9CA3AF] text-sm font-semibold">
          Quản lý hồ sơ và cấu hình hệ thống
        </p>
      </div>

      {/* Profile hero — full width navy */}
      <div className="ac">
        <SettingsProfileHero />
      </div>

      {/* Store info (2/3) + Notifications (1/3) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 min-h-72">
          <SettingsStore />
        </div>
        <div className="min-h-72">
          <SettingsNotifications />
        </div>
      </div>

      {/* Security — full width, 2-column internal */}
      <div className="ac">
        <SettingsSecurity />
      </div>

      {/* Appearance — full width */}
      <div className="ac">
        <SettingsAppearance />
      </div>
    </div>
  );
}
