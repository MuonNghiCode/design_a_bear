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
  isValidVietnamPhoneNumber,
  normalizePhoneNumber,
} from "@/utils/address";
import ProfileHero from "./ProfileHero";
import ProfileStats from "./ProfileStats";
import ProfileInfoCard, { type AddressForm } from "./ProfileInfoCard";
import ProfileMembershipCard from "./ProfileMembershipCard";
import ProfileTabs from "./ProfileTabs";

const EMPTY_ADDRESS_FORM: AddressForm = {
  streetAddress: "",
  province: "",
  provinceName: "",
  district: "",
  districtName: "",
  ward: "",
  wardName: "",
};

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
  const [addressDisplay, setAddressDisplay] = useState("Đang cập nhật");
  const [addressForm, setAddressForm] =
    useState<AddressForm>(EMPTY_ADDRESS_FORM);
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
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        if (profile?.fullName) setName(profile.fullName);
        if (profile?.phoneNumber) setPhone(profile.phoneNumber);
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
        const addrs = addressResult.value.value ?? [];
        setAddresses(addrs);
        const selected = addrs.find((a) => a.isDefaultShipping) ?? addrs[0];

        if (selected) {
          if (selected.phoneNumber) setPhone(selected.phoneNumber);

          // line1 = địa chỉ cụ thể, line2 = phường/xã
          const display = [
            selected.line1,
            selected.line2,
            selected.state,
            selected.city,
          ]
            .map((v) => (v || "").trim())
            .filter(Boolean)
            .join(", ");
          setAddressDisplay(display || "Chưa có địa chỉ");
          setCurrentAddressId(selected.addressId);

          setAddressForm({
            streetAddress: selected.line1 || "",
            province: "",
            provinceName: selected.city || "",
            district: "",
            districtName: selected.state || "",
            ward: "",
            wardName: selected.line2 || "",
          });
        } else {
          setPhone("Chưa có số điện thoại");
          setAddressDisplay("Chưa có địa chỉ");
          setAddressForm(EMPTY_ADDRESS_FORM);
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

      // line1 = địa chỉ cụ thể, line2 = phường/xã
      const line1 = addressForm.streetAddress.trim();

      if (user?.id && line1) {
        let success = false;
        let finalSel: Address | null = null;

        const addressData = {
          label: null,
          fullName: name.trim(),
          phoneNumber: normalizedPhone,
          email: user.email,
          line1,
          line2: addressForm.wardName.trim() || null,
          city: addressForm.provinceName || "",
          state: addressForm.districtName || "",
          postalCode: null,
          country: null,
          isDefaultShipping: true,
          isDefaultBilling: true,
        };

        if (currentAddressId) {
          const upRes = await addressService.updateAddress(
            currentAddressId,
            addressData,
          );
          success = !upRes.isFailure;
        } else {
          const createRes = await addressService.createAddress({
            userId: user.id,
            ...addressData,
          });
          success = !createRes.isFailure;
          if (success) setCurrentAddressId(createRes.value?.addressId || null);
        }

        if (success) {
          const refreshedAddresses = await addressService.getMyAddresses();
          if (!refreshedAddresses.isFailure) {
            const next = refreshedAddresses.value ?? [];
            setAddresses(next);
            const sel = next.find((a) => a.isDefaultShipping) ?? next[0];
            if (sel) {
              const display = [sel.line1, sel.line2, sel.state, sel.city]
                .map((v) => (v || "").trim())
                .filter(Boolean)
                .join(", ");
              setAddressDisplay(display || addressDisplay);
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

  if (!mounted || loading) return null;
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
            addressDisplay={addressDisplay}
            addressForm={addressForm}
            saving={savingProfile}
            saveMessage={saveProfileMessage}
            saveError={saveProfileError}
            setName={setName}
            setPhone={(v) => {
              setSaveProfileError(null);
              setSaveProfileMessage(null);
              setPhone(v);
            }}
            setAddressForm={setAddressForm}
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
