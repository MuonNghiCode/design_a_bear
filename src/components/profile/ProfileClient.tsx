"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CFG } from "@/data/profile";
import { userService } from "@/services/user.service";
import { addressService } from "@/services/address.service";
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
  const [phone, setPhone] = useState("Đang cập nhật");
  const [address, setAddress] = useState("Đang cập nhật");

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

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const loadProfileData = async () => {
      const [profileResult, addressResult] = await Promise.allSettled([
        userService.getProfile(),
        addressService.getMyAddresses(),
      ]);

      if (!isMounted) return;

      if (
        profileResult.status === "fulfilled" &&
        profileResult.value.isSuccess
      ) {
        const profile = profileResult.value.value;
        if (profile?.fullName) {
          setName(profile.fullName);
        }
      }

      if (
        addressResult.status === "fulfilled" &&
        addressResult.value.isSuccess
      ) {
        const addresses = addressResult.value.value ?? [];
        const selectedAddress =
          addresses.find((a) => a.isDefaultShipping) ?? addresses[0];

        if (selectedAddress) {
          if (selectedAddress.phoneNumber) {
            setPhone(selectedAddress.phoneNumber);
          }

          const mergedAddress = [
            selectedAddress.line1,
            selectedAddress.line2,
            selectedAddress.state,
            selectedAddress.city,
          ]
            .filter(Boolean)
            .join(", ");

          setAddress(mergedAddress || "Chưa có địa chỉ");
        } else {
          setPhone("Chưa có số điện thoại");
          setAddress("Chưa có địa chỉ");
        }
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

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

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 pb-20 grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-1 flex flex-col gap-6">
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
