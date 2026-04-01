"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ROLE_CFG } from "@/data/profile";
import { userService } from "@/services/user.service";
import { addressService } from "@/services/address.service";
import type { Address } from "@/types";
import {
  composeAddressText,
  isValidVietnamPhoneNumber,
  normalizePhoneNumber,
  parseAddressTextDetailed,
} from "@/utils/address";
import ProfileHero from "./ProfileHero";
import ProfileStats from "./ProfileStats";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileMembershipCard from "./ProfileMembershipCard";
import ProfileTabs from "./ProfileTabs";

export default function ProfileClient() {
  const { user, logout, isAuthenticated, loading, updateCurrentUser } =
    useAuth();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "orders";
  const [tab, setTab] = useState(initialTab);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("Đang cập nhật");
  const [address, setAddress] = useState("Đang cập nhật");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [timezone, setTimezone] = useState<string | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveProfileMessage, setSaveProfileMessage] = useState<string | null>(
    null,
  );
  const [saveProfileError, setSaveProfileError] = useState<string | null>(null);

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
        if (profile?.phoneNumber) {
          setPhone(profile.phoneNumber);
        }
        setDateOfBirth(profile?.dateOfBirth);
        setGender(profile?.gender);
        setLanguage(profile?.language);
        setTimezone(profile?.timezone);
        setAvatarUrl(profile?.avatarUrl ?? undefined);
        setStatus(profile?.status);
      }

      if (
        addressResult.status === "fulfilled" &&
        addressResult.value.isSuccess
      ) {
        const addresses = addressResult.value.value ?? [];
        setAddresses(addresses);
        const selectedAddress =
          addresses.find((a) => a.isDefaultShipping) ?? addresses[0];

        if (selectedAddress) {
          if (selectedAddress.phoneNumber) {
            setPhone(selectedAddress.phoneNumber);
          }

          const mergedAddress = composeAddressText(selectedAddress);

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

  const handleSaveProfile = async () => {
    const normalizedPhone = normalizePhoneNumber(phone);

    if (!name.trim() || !normalizedPhone) {
      setSaveProfileError("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      toast.error("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }

    if (!isValidVietnamPhoneNumber(normalizedPhone)) {
      setSaveProfileError(
        "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.",
      );
      toast.error("Số điện thoại không hợp lệ.");
      return;
    }

    setSavingProfile(true);
    setSaveProfileMessage(null);
    setSaveProfileError(null);

    try {
      const response = await userService.updateProfile({
        fullName: name.trim(),
        phoneNumber: normalizedPhone,
        dateOfBirth,
        gender,
        language,
        timezone,
        avatarUrl,
        status,
      });

      if (response.isFailure) {
        throw new Error(
          response.error?.description || "Không thể cập nhật thông tin cá nhân",
        );
      }

      // Replace address set: create new current address then remove older ones.
      if (user?.id && address.trim()) {
        const parsedAddress = parseAddressTextDetailed(address);
        const createAddressRes = await addressService.createAddress({
          userId: user.id,
          label: null,
          fullName: name.trim(),
          phoneNumber: normalizedPhone,
          email: user.email,
          line1: parsedAddress.line1,
          line2: parsedAddress.line2,
          city: parsedAddress.city,
          state: parsedAddress.state,
          postalCode: null,
          country: null,
          isDefaultShipping: true,
          isDefaultBilling: true,
        });

        if (!createAddressRes.isFailure) {
          const newAddressId = createAddressRes.value?.addressId;

          await Promise.allSettled(
            addresses
              .filter((a) => a.addressId !== newAddressId)
              .map((a) => addressService.deleteAddress(a.addressId)),
          );

          const refreshedAddresses = await addressService.getMyAddresses();
          if (!refreshedAddresses.isFailure) {
            const next = refreshedAddresses.value ?? [];
            setAddresses(next);
            const selected = next.find((a) => a.isDefaultShipping) ?? next[0];
            if (selected) {
              const mergedAddress = composeAddressText(selected);
              setAddress(mergedAddress || address);
            }
          }
        }
      }

      updateCurrentUser({ name: name.trim() });

      setSaveProfileMessage("Đã cập nhật thông tin cá nhân thành công.");
      toast.success("Cập nhật thông tin cá nhân thành công.");
      setEditMode(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể cập nhật thông tin cá nhân";
      setSaveProfileError(message);
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
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
            saving={savingProfile}
            saveMessage={saveProfileMessage}
            saveError={saveProfileError}
            setName={setName}
            setPhone={(v) => {
              setSaveProfileError(null);
              setSaveProfileMessage(null);
              setPhone(v);
            }}
            setAddress={setAddress}
            onSave={() => void handleSaveProfile()}
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
