"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CFG } from "@/data/profile";
import ProfileHero from "./ProfileHero";
import ProfileStats from "./ProfileStats";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileMembershipCard from "./ProfileMembershipCard";
import ProfileTabs from "./ProfileTabs";

export default function ProfileClient() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "orders";
  const [tab, setTab] = useState(initialTab);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("0901 234 567");
  const [address, setAddress] = useState("123 Nguyễn Huệ, Quận 1, TP.HCM");

  const heroRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/auth");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll<HTMLElement>(".ac");
    gsap.set(els, { y: 32, opacity: 0 });
    gsap.to(els, {
      y: 0,
      opacity: 1,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });
  }, []);

  const switchTab = (key: string) => {
    if (key === tab) return;
    gsap.to(tabContentRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setTab(key);
        gsap.fromTo(
          tabContentRef.current,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
        );
      },
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (loading) return null;
  if (!user) return null;

  const roleCfg = ROLE_CFG[user.role ?? "user"];
  const initials = user.name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="min-h-screen bg-[#F4F7FF]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div ref={heroRef}>
        <ProfileHero
          user={user}
          initials={initials}
          roleCfg={roleCfg}
          editMode={editMode}
          onEditToggle={() => setEditMode((v) => !v)}
          onLogout={handleLogout}
        />
      </div>

      <ProfileStats />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-5">
          <ProfileInfoCard
            user={user}
            editMode={editMode}
            name={name}
            phone={phone}
            address={address}
            setName={setName}
            setPhone={setPhone}
            setAddress={setAddress}
            onSave={() => setEditMode(false)}
          />
          <ProfileMembershipCard />
        </div>

        <ProfileTabs
          tab={tab}
          onSwitch={switchTab}
          tabContentRef={tabContentRef}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}
