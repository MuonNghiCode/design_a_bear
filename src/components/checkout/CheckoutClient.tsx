"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { z } from "zod";
import { Provinces, Districts } from "vietnam-provinces-js";
import { useCart } from "@/contexts/CartContext";
import {
  IoArrowBack,
  IoArrowForward,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoChatbubbleOutline,
  IoCheckmarkCircle,
  IoGiftOutline,
  IoHomeOutline,
  IoLockClosedOutline,
  IoCheckmark,
  IoSparklesOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

/* ─────────────────────────────────────────────
   Validation Schema
   ───────────────────────────────────────────── */
const deliverySchema = z.object({
  name: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
  phone: z.string().regex(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  email: z
    .string()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Email không hợp lệ",
    }),
  province: z.string().min(1, "Vui lòng chọn tỉnh / thành"),
  district: z.string().min(1, "Vui lòng chọn quận / huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường / xã"),
  address: z.string().min(5, "Địa chỉ ít nhất 5 ký tự"),
});

/* ─────────────────────────────────────────────
   SVG Atoms
   ───────────────────────────────────────────── */
function PawPrint({
  className,
  color,
  size = 18,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color ?? "currentColor"}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="9" cy="4" rx="2.5" ry="3" />
      <ellipse cx="15" cy="4" rx="2.5" ry="3" />
      <ellipse cx="5" cy="9" rx="2" ry="2.5" />
      <ellipse cx="19" cy="9" rx="2" ry="2.5" />
      <path d="M12 8c-4.5 0-8 3.5-8 8 0 2 1.5 4 4 4h8c2.5 0 4-2 4-4 0-4.5-3.5-8-8-8z" />
    </svg>
  );
}

function IconCOD({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect
        x="4"
        y="10"
        width="32"
        height="22"
        rx="4"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="4"
        y="10"
        width="32"
        height="22"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="16"
        width="32"
        height="6"
        fill="currentColor"
        opacity="0.25"
      />
      <circle cx="12" cy="26" r="3" fill="currentColor" opacity="0.6" />
      <rect
        x="18"
        y="24"
        width="12"
        height="4"
        rx="2"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

function IconBank({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 4L36 12H4L20 4Z" fill="currentColor" opacity="0.8" />
      <rect
        x="7"
        y="12"
        width="4"
        height="16"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="18"
        y="12"
        width="4"
        height="16"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="29"
        y="12"
        width="4"
        height="16"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="4"
        y="28"
        width="32"
        height="4"
        rx="2"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

function IconMomo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="MoMo"
    >
      <circle cx="20" cy="20" r="20" fill="#AE2070" />
      {/* White M — brand mark */}
      <path
        d="M9 28 L9 13 L20 23 L31 13 L31 28"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconVNPay({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="VNPay"
    >
      <rect width="40" height="40" rx="7" fill="#0066CC" />
      {/* QR corner markers — top-left */}
      <rect
        x="5"
        y="5"
        width="11"
        height="11"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="7.5" y="7.5" width="5" height="5" rx="0.5" fill="white" />
      {/* top-right */}
      <rect
        x="24"
        y="5"
        width="11"
        height="11"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="26.5" y="7.5" width="5" height="5" rx="0.5" fill="white" />
      {/* bottom-left */}
      <rect
        x="5"
        y="24"
        width="11"
        height="11"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="7.5" y="26.5" width="5" height="5" rx="0.5" fill="white" />
      {/* QR data dots — bottom-right quadrant */}
      <rect
        x="24"
        y="24"
        width="5"
        height="2"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="24"
        y="28"
        width="11"
        height="2"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="24"
        y="32"
        width="7"
        height="2"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="33"
        y="24"
        width="2"
        height="6"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Step Tracker — Vertical Paw Trail
   ───────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Giao hàng", sub: "Địa chỉ nhận" },
  { id: 2, label: "Thanh toán", sub: "Phương thức" },
  { id: 3, label: "Xác nhận", sub: "Hoàn tất" },
];

function StepTracker({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="relative w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500"
                style={{
                  backgroundColor: done
                    ? "#4ECDC4"
                    : active
                      ? "#17409A"
                      : "#E5E7EB",
                  color: done || active ? "white" : "#9CA3AF",
                  boxShadow: active
                    ? "0 0 0 4px rgba(23, 64, 154, 0.18)"
                    : done
                      ? "0 0 0 4px rgba(78, 205, 196, 0.18)"
                      : "none",
                  transform: active ? "scale(1.08)" : "scale(1)",
                }}
              >
                {done ? (
                  <IoCheckmark className="text-base" />
                ) : (
                  <span style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {String(s.id).padStart(2, "0")}
                  </span>
                )}
                {active && (
                  <span
                    className="absolute inset-0 rounded-2xl animate-ping"
                    style={{ backgroundColor: "rgba(23,64,154,0.15)" }}
                  />
                )}
              </div>
              <div className="text-center">
                <p
                  className="text-xs font-bold leading-none"
                  style={{
                    color: active ? "#17409A" : done ? "#4ECDC4" : "#9CA3AF",
                  }}
                >
                  {s.label}
                </p>
                <p className="text-[10px]" style={{ color: "#C4C9D4" }}>
                  {s.sub}
                </p>
              </div>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="flex items-center gap-1 px-2 mb-6">
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: 5,
                      height: 5,
                      backgroundColor: current > s.id ? "#4ECDC4" : "#E5E7EB",
                      opacity: 1 - dot * 0.2,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Custom Input
   ───────────────────────────────────────────── */
function FormField({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  icon: React.ElementType;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <label
        className="block text-xs font-bold mb-1.5 transition-colors duration-200"
        style={{ color: focused ? "#17409A" : "#6B7280" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#FF6B9D" }}>
            *
          </span>
        )}
      </label>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300"
        style={{
          backgroundColor: focused ? "#FFFFFF" : "#F8FAFF",
          border: `2px solid ${error ? "#EF4444" : focused ? "#17409A" : "#E5E7EB"}`,
          boxShadow: focused ? "0 0 0 4px rgba(23, 64, 154, 0.08)" : "none",
        }}
      >
        <Icon
          className="shrink-0 text-base transition-colors duration-200"
          style={{ color: focused ? "#17409A" : "#9CA3AF" }}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder ?? label}
          className="flex-1 text-sm font-semibold bg-transparent outline-none placeholder:font-normal"
          style={{
            color: "#1A1A2E",
            fontFamily: "'Nunito', sans-serif",
          }}
        />
      </div>
      {error && (
        <p
          className="mt-1.5 text-xs font-semibold"
          style={{ color: "#EF4444" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-xs font-bold mb-1.5"
        style={{
          color: focused ? "#17409A" : "#6B7280",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#FF6B9D" }}>
            *
          </span>
        )}
      </label>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300"
        style={{
          backgroundColor: disabled
            ? "#F0F2F7"
            : focused
              ? "#FFFFFF"
              : "#F8FAFF",
          border: `2px solid ${error ? "#EF4444" : focused && !disabled ? "#17409A" : "#E5E7EB"}`,
          boxShadow:
            focused && !disabled ? "0 0 0 4px rgba(23, 64, 154, 0.08)" : "none",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "default",
        }}
      >
        <Icon
          className="shrink-0 text-base"
          style={{ color: focused && !disabled ? "#17409A" : "#9CA3AF" }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="flex-1 text-sm font-semibold bg-transparent outline-none disabled:cursor-not-allowed"
          style={{
            color: value ? "#1A1A2E" : "#9CA3AF",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <option value="" disabled>
            {label}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p
          className="mt-1.5 text-xs font-semibold"
          style={{ color: "#EF4444" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1 — Delivery
   ───────────────────────────────────────────── */
interface DeliveryForm {
  name: string;
  phone: string;
  email: string;
  province: string; // idProvince
  provinceName: string;
  district: string; // idDistrict
  districtName: string;
  ward: string; // idCommune
  wardName: string;
  address: string;
  note: string;
}

function StepDelivery({
  form,
  onChange,
  showErrors = false,
}: {
  form: DeliveryForm;
  onChange: (f: DeliveryForm) => void;
  showErrors?: boolean;
}) {
  const [provinces, setProvinces] = useState<
    Array<{ idProvince: string; name: string }>
  >([]);
  const [districts, setDistricts] = useState<
    Array<{ idDistrict: string; name: string }>
  >([]);
  const [communes, setCommunes] = useState<
    Array<{ idCommune: string; name: string }>
  >([]);
  const [loadingD, setLoadingD] = useState(false);
  const [loadingC, setLoadingC] = useState(false);

  useEffect(() => {
    Provinces.getAllProvince().then(setProvinces);
  }, []);

  useEffect(() => {
    if (!form.province) {
      setDistricts([]);
      setCommunes([]);
      return;
    }
    setLoadingD(true);
    Provinces.getDistrictsByProvinceId(form.province)
      .then(setDistricts)
      .finally(() => setLoadingD(false));
  }, [form.province]);

  useEffect(() => {
    if (!form.district) {
      setCommunes([]);
      return;
    }
    setLoadingC(true);
    Districts.getCommunesByDistrictId(form.district)
      .then(setCommunes)
      .finally(() => setLoadingC(false));
  }, [form.district]);

  const set = (k: keyof DeliveryForm) => (v: string) =>
    onChange({ ...form, [k]: v });

  const fieldErr = (key: string): string | undefined => {
    if (!showErrors) return undefined;
    const result = deliverySchema.safeParse({
      name: form.name,
      phone: form.phone,
      email: form.email,
      province: form.province,
      district: form.district,
      ward: form.ward,
      address: form.address,
    });
    if (result.success) return undefined;
    const issue = result.error.issues.find((i) => i.path[0] === key);
    return issue?.message;
  };

  const selectProvince = (id: string) => {
    const p = provinces.find((x) => x.idProvince === id);
    onChange({
      ...form,
      province: id,
      provinceName: p?.name ?? "",
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
    });
  };

  const selectDistrict = (id: string) => {
    const d = districts.find((x) => x.idDistrict === id);
    onChange({
      ...form,
      district: id,
      districtName: d?.name ?? "",
      ward: "",
      wardName: "",
    });
  };

  const selectWard = (id: string) => {
    const c = communes.find((x) => x.idCommune === id);
    onChange({ ...form, ward: id, wardName: c?.name ?? "" });
  };

  return (
    <div className="space-y-5">
      {/* Watermark */}
      <div
        className="absolute top-8 right-8 text-[160px] font-black leading-none select-none pointer-events-none"
        style={{
          color: "#E8EDF7",
          fontFamily: "'Nunito', sans-serif",
          zIndex: 0,
        }}
        aria-hidden
      >
        01
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(23,64,154,0.08)" }}
          >
            <IoHomeOutline className="text-xl" style={{ color: "#17409A" }} />
          </div>
          <div>
            <h2
              className="text-xl font-black"
              style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
            >
              Giao hàng đến đâu?
            </h2>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Điền địa chỉ để chúng tôi gửi gấu tận nơi nhé
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              icon={IoPersonOutline}
              label="Họ và tên"
              value={form.name}
              onChange={set("name")}
              required
              error={fieldErr("name")}
            />
            <FormField
              icon={IoCallOutline}
              label="Số điện thoại"
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              required
              error={fieldErr("phone")}
            />
          </div>

          <FormField
            icon={IoMailOutline}
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="email@example.com"
            error={fieldErr("email")}
          />

          <SelectField
            icon={IoLocationOutline}
            label={provinces.length === 0 ? "Đang tải..." : "Tỉnh / Thành phố"}
            value={form.province}
            onChange={selectProvince}
            options={provinces.map((p) => ({
              value: p.idProvince,
              label: p.name,
            }))}
            disabled={provinces.length === 0}
            required
            error={fieldErr("province")}
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              icon={IoLocationOutline}
              label={loadingD ? "Đang tải..." : "Quận / Huyện"}
              value={form.district}
              onChange={selectDistrict}
              options={districts.map((d) => ({
                value: d.idDistrict,
                label: d.name,
              }))}
              disabled={!form.province || loadingD}
              error={fieldErr("district")}
            />
            <SelectField
              icon={IoLocationOutline}
              label={loadingC ? "Đang tải..." : "Phường / Xã"}
              value={form.ward}
              onChange={selectWard}
              options={communes.map((c) => ({
                value: c.idCommune,
                label: c.name,
              }))}
              disabled={!form.district || loadingC}
              error={fieldErr("ward")}
            />
          </div>

          <FormField
            icon={IoLocationOutline}
            label="Địa chỉ cụ thể"
            value={form.address}
            onChange={set("address")}
            placeholder="Số nhà, tên đường..."
            required
            error={fieldErr("address")}
          />

          {/* Note */}
          <div>
            <label
              className="block text-xs font-bold mb-1.5"
              style={{ color: "#6B7280" }}
            >
              Ghi chú cho tài xế
            </label>
            <div
              className="flex gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300"
              style={{
                backgroundColor: "#F8FAFF",
                border: "2px solid #E5E7EB",
              }}
            >
              <IoChatbubbleOutline
                className="shrink-0 text-base mt-0.5"
                style={{ color: "#9CA3AF" }}
              />
              <textarea
                value={form.note}
                onChange={(e) => set("note")(e.target.value)}
                placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..."
                rows={2}
                className="flex-1 text-sm font-semibold bg-transparent outline-none resize-none placeholder:font-normal"
                style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 2 — Payment
   ───────────────────────────────────────────── */
const PAYMENT_OPTIONS = [
  {
    id: "cod",
    label: "Tiền mặt khi nhận",
    brief: "Trả tại cửa, không cần thẻ",
    color: "#4ECDC4",
    bg: "rgba(78,205,196,0.08)",
    Icon: IconCOD,
  },
  {
    id: "bank",
    label: "Chuyển khoản",
    brief: "Ngân hàng nội địa / quốc tế",
    color: "#17409A",
    bg: "rgba(23,64,154,0.08)",
    Icon: IconBank,
  },
  {
    id: "momo",
    label: "Ví MoMo",
    brief: "Quét mã, thanh toán nhanh",
    color: "#AE2070",
    bg: "rgba(174,32,112,0.08)",
    Icon: IconMomo,
  },
  {
    id: "vnpay",
    label: "VNPay QR",
    brief: "Mọi ngân hàng, dễ dàng",
    color: "#0066CC",
    bg: "rgba(0,102,204,0.08)",
    Icon: IconVNPay,
  },
];

function StepPayment({
  method,
  onChange,
}: {
  method: string;
  onChange: (m: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Watermark */}
      <div
        className="absolute top-8 right-8 text-[160px] font-black leading-none select-none pointer-events-none"
        style={{
          color: "#E8EDF7",
          fontFamily: "'Nunito', sans-serif",
          zIndex: 0,
        }}
        aria-hidden
      >
        02
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(23,64,154,0.08)" }}
          >
            <IoSparklesOutline
              className="text-xl"
              style={{ color: "#17409A" }}
            />
          </div>
          <div>
            <h2
              className="text-xl font-black"
              style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
            >
              Thanh toán như thế nào?
            </h2>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Chọn phương thức phù hợp với bạn nhất
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {PAYMENT_OPTIONS.map((opt) => {
            const selected = method === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className="relative text-left rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: selected ? opt.bg : "#F8FAFF",
                  border: `2px solid ${selected ? opt.color : "#E5E7EB"}`,
                  boxShadow: selected
                    ? `0 0 0 3px ${opt.color}22, 0 8px 24px ${opt.color}18`
                    : "none",
                  transform: selected ? "translateY(-2px)" : "none",
                }}
              >
                {/* Selected tick */}
                {selected && (
                  <div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: opt.color }}
                  >
                    <IoCheckmark className="text-white text-xs" />
                  </div>
                )}

                {/* Icon area */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: selected ? `${opt.color}22` : "#EDEFF5",
                    color: selected ? opt.color : "#9CA3AF",
                  }}
                >
                  <opt.Icon size={28} />
                </div>

                <p
                  className="font-black text-sm mb-1 leading-snug"
                  style={{
                    color: selected ? opt.color : "#1A1A2E",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {opt.label}
                </p>
                <p
                  className="text-xs leading-snug"
                  style={{ color: "#9CA3AF" }}
                >
                  {opt.brief}
                </p>
              </button>
            );
          })}
        </div>

        {/* Extra info for selected method */}
        {method === "bank" && (
          <div
            className="mt-4 rounded-3xl p-5"
            style={{
              backgroundColor: "rgba(23,64,154,0.04)",
              border: "1.5px dashed #17409A40",
            }}
          >
            <p className="text-xs font-bold mb-3" style={{ color: "#17409A" }}>
              Thông tin chuyển khoản
            </p>
            <div className="space-y-1.5">
              {[
                ["Ngân hàng", "Vietcombank"],
                ["Số tài khoản", "1023 4567 8910"],
                ["Chủ tài khoản", "DESIGN A BEAR CO., LTD"],
                ["Nội dung", "DAB — [Tên của bạn]"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>
                    {k}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#1A1A2E" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(method === "momo" || method === "vnpay") && (
          <div
            className="mt-4 rounded-3xl p-5 flex items-center gap-4"
            style={{
              backgroundColor:
                method === "momo"
                  ? "rgba(174,32,112,0.04)"
                  : "rgba(0,102,204,0.04)",
              border: `1.5px dashed ${method === "momo" ? "#AE207040" : "#0066CC40"}`,
            }}
          >
            {/* QR placeholder */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: method === "momo" ? "#AE207015" : "#0066CC15",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke={method === "momo" ? "#AE2070" : "#0066CC"}
                  strokeWidth="2"
                />
                <rect
                  x="28"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke={method === "momo" ? "#AE2070" : "#0066CC"}
                  strokeWidth="2"
                />
                <rect
                  x="4"
                  y="28"
                  width="16"
                  height="16"
                  rx="2"
                  stroke={method === "momo" ? "#AE2070" : "#0066CC"}
                  strokeWidth="2"
                />
                <rect
                  x="8"
                  y="8"
                  width="8"
                  height="8"
                  rx="1"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.4"
                />
                <rect
                  x="32"
                  y="8"
                  width="8"
                  height="8"
                  rx="1"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.4"
                />
                <rect
                  x="8"
                  y="32"
                  width="8"
                  height="8"
                  rx="1"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="8"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.3"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="4"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                />
              </svg>
            </div>
            <div>
              <p
                className="text-xs font-bold mb-1"
                style={{
                  color: method === "momo" ? "#AE2070" : "#0066CC",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Quét mã QR để thanh toán
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#9CA3AF" }}
              >
                Mở ứng dụng <b>{method === "momo" ? "MoMo" : "VNPay"}</b>, chọn
                quét mã QR và hoàn tất thanh toán.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 3 — Confirm
   ───────────────────────────────────────────── */
function StepConfirm({
  form,
  method,
  agreed,
  setAgreed,
}: {
  form: DeliveryForm;
  method: string;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
}) {
  const payOpt = PAYMENT_OPTIONS.find((p) => p.id === method)!;

  return (
    <div className="space-y-5">
      {/* Watermark */}
      <div
        className="absolute top-8 right-8 text-[160px] font-black leading-none select-none pointer-events-none"
        style={{
          color: "#E8EDF7",
          fontFamily: "'Nunito', sans-serif",
          zIndex: 0,
        }}
        aria-hidden
      >
        03
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(78,205,196,0.12)" }}
          >
            <IoShieldCheckmarkOutline
              className="text-xl"
              style={{ color: "#4ECDC4" }}
            />
          </div>
          <div>
            <h2
              className="text-xl font-black"
              style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
            >
              Xác nhận đơn hàng
            </h2>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Kiểm tra lại thông tin trước khi đặt nhé!
            </p>
          </div>
        </div>

        {/* Delivery recap */}
        <div
          className="rounded-3xl p-5 mb-4"
          style={{
            backgroundColor: "#F8FAFF",
            border: "2px solid #E5E7EB",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <IoHomeOutline style={{ color: "#17409A" }} />
            <p
              className="text-sm font-black"
              style={{ color: "#17409A", fontFamily: "'Nunito', sans-serif" }}
            >
              Địa chỉ giao hàng
            </p>
          </div>
          <div className="space-y-1">
            {(
              [
                ["Người nhận", form.name || "—"],
                ["Điện thoại", form.phone || "—"],
                ["Email", form.email || "—"],
                [
                  "Địa chỉ",
                  [
                    form.address,
                    form.wardName,
                    form.districtName,
                    form.provinceName,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—",
                ],
                ...(form.note ? [["Ghi chú", form.note]] : []),
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span
                  className="text-xs shrink-0 w-24"
                  style={{ color: "#9CA3AF" }}
                >
                  {k}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#1A1A2E" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment recap */}
        <div
          className="rounded-3xl p-5 mb-6"
          style={{
            backgroundColor: payOpt.bg,
            border: `2px solid ${payOpt.color}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${payOpt.color}20`,
                color: payOpt.color,
              }}
            >
              <payOpt.Icon size={22} />
            </div>
            <div>
              <p
                className="text-sm font-black"
                style={{
                  color: payOpt.color,
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {payOpt.label}
              </p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                {payOpt.brief}
              </p>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            className="mt-0.5 w-5 h-5 rounded-lg shrink-0 flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: agreed ? "#17409A" : "transparent",
              border: `2px solid ${agreed ? "#17409A" : "#D1D5DB"}`,
            }}
            onClick={() => setAgreed(!agreed)}
          >
            {agreed && <IoCheckmark className="text-white text-xs" />}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
            Tôi đồng ý với{" "}
            <span style={{ color: "#17409A" }} className="font-bold">
              Điều khoản dịch vụ
            </span>{" "}
            và{" "}
            <span style={{ color: "#17409A" }} className="font-bold">
              Chính sách bảo mật
            </span>{" "}
            của Design a Bear.
          </p>
        </label>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Success Screen
   ───────────────────────────────────────────── */
function SuccessScreen({ orderId }: { orderId: string }) {
  const confRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confRef.current) return;
    // Stagger confetti dots
    const dots = confRef.current.querySelectorAll(".conf-dot");
    gsap.fromTo(
      dots,
      { y: 0, opacity: 1, scale: 0 },
      {
        y: () => -80 - Math.random() * 80,
        x: () => (Math.random() - 0.5) * 120,
        opacity: 0,
        scale: () => 0.5 + Math.random() * 1,
        duration: () => 0.8 + Math.random() * 0.6,
        stagger: 0.04,
        ease: "power3.out",
      },
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center relative overflow-hidden">
      {/* Confetti burst */}
      <div
        ref={confRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="conf-dot absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: ["#17409A", "#FF6B9D", "#4ECDC4", "#F7C948"][
                i % 4
              ],
              transform: `rotate(${i * 18}deg)`,
            }}
          />
        ))}
      </div>

      {/* Bear celebrate */}
      <div
        className="w-28 h-28 rounded-3xl mb-6 flex items-center justify-center shadow-xl"
        style={{
          background: "linear-gradient(135deg, #17409A 0%, #0E2A66 100%)",
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
          <ellipse cx="32" cy="38" rx="18" ry="16" fill="#D4A76A" />
          <circle cx="32" cy="22" r="14" fill="#D4A76A" />
          <circle cx="20" cy="11" r="6" fill="#D4A76A" />
          <circle cx="44" cy="11" r="6" fill="#D4A76A" />
          <circle cx="20" cy="11" r="3.5" fill="#C4956A" />
          <circle cx="44" cy="11" r="3.5" fill="#C4956A" />
          <circle cx="27" cy="20" r="2" fill="#4A3728" />
          <circle cx="37" cy="20" r="2" fill="#4A3728" />
          <path
            d="M28 27 Q32 31 36 27"
            stroke="#4A3728"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="32" cy="40" rx="10" ry="9" fill="#E8C99A" />
          <ellipse
            cx="14"
            cy="40"
            rx="5"
            ry="9"
            fill="#D4A76A"
            transform="rotate(-15 14 40)"
          />
          <ellipse
            cx="50"
            cy="40"
            rx="5"
            ry="9"
            fill="#D4A76A"
            transform="rotate(15 50 40)"
          />
          {/* Stars around */}
          <path d="M6 6l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#F7C948" />
          <path
            d="M55 8l0.8 2.4 2.4 0.8-2.4 0.8L55 15l-0.8-2.4-2.4-0.8 2.4-0.8z"
            fill="#FF6B9D"
          />
        </svg>
      </div>

      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold"
        style={{ backgroundColor: "rgba(78,205,196,0.1)", color: "#4ECDC4" }}
      >
        <IoCheckmarkCircle />
        Đặt hàng thành công!
      </div>

      <h2
        className="text-2xl font-black mb-2"
        style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
      >
        Cảm ơn bạn đã tin tưởng!
      </h2>
      <p className="text-sm leading-relaxed mb-2" style={{ color: "#6B7280" }}>
        Đơn hàng{" "}
        <span className="font-bold" style={{ color: "#17409A" }}>
          #{orderId}
        </span>{" "}
        đã được xác nhận.
      </p>
      <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B7280" }}>
        Chú gấu của bạn đang được chuẩn bị và sẽ tới tay bé trong 2–5 ngày làm
        việc.
      </p>

      <div className="flex gap-3">
        <Link
          href="/products"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "#F4F7FF",
            color: "#17409A",
            border: "2px solid #17409A30",
          }}
        >
          <IoArrowBack className="text-base" />
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #17409A 0%, #0E2A66 100%)",
          }}
        >
          <IoHomeOutline className="text-base" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Order Summary Panel (Right)
   ───────────────────────────────────────────── */
const FREE_SHIP = 500_000;

function OrderSummary({
  shippingFee,
  discount,
  finalTotal,
  coupon,
  onCouponChange,
  onApplyCoupon,
  couponApplied,
  step,
}: {
  shippingFee: number;
  discount: number;
  finalTotal: number;
  coupon: string;
  onCouponChange: (v: string) => void;
  onApplyCoupon: () => void;
  couponApplied: boolean;
  step: number;
}) {
  const { items, totalItems, totalPrice } = useCart();
  const freeShip = totalPrice >= FREE_SHIP;
  const barWidth = Math.min((totalPrice / FREE_SHIP) * 100, 100);

  return (
    <div
      className="h-full flex flex-col overflow-y-auto"
      style={{
        fontFamily: "'Nunito', sans-serif",
        backgroundColor: "#FFFFFF",
        borderLeft: "1px solid #E5E7EB",
      }}
    >
      {/* Header */}
      <div
        className="px-7 pt-8 pb-6 shrink-0"
        style={{ borderBottom: "1px solid #E5E7EB" }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <PawPrint color="#17409A" size={18} />
          <h3 className="text-lg font-black" style={{ color: "#1A1A2E" }}>
            Đơn hàng của bạn
          </h3>
        </div>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          {totalItems} sản phẩm · {fmt(totalPrice)}
        </p>
      </div>

      {/* Free shipping bar */}
      <div
        className="mx-7 mt-5 mb-4 p-4 rounded-2xl shrink-0"
        style={{ backgroundColor: "#F4F7FF" }}
      >
        {freeShip ? (
          <div className="flex items-center gap-2">
            <IoGiftOutline style={{ color: "#4ECDC4" }} className="text-base" />
            <p className="text-xs font-bold" style={{ color: "#4ECDC4" }}>
              Miễn phí vận chuyển rồi!
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Còn thiếu để freeship
              </p>
              <p className="text-xs font-bold" style={{ color: "#17409A" }}>
                {fmt(FREE_SHIP - totalPrice)}
              </p>
            </div>
          </>
        )}
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#E5E7EB" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${barWidth}%`,
              background: "linear-gradient(90deg, #4ECDC4, #45B7D1)",
            }}
          />
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-7 space-y-3 pb-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-3.5 items-center py-3"
            style={{ borderBottom: "1px solid #F3F4F6" }}
          >
            {/* Image */}
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 relative"
              style={{ backgroundColor: "#F0F4FF" }}
            >
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-cover"
              />
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                style={{ backgroundColor: "#FF6B9D" }}
              >
                {item.quantity}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-bold leading-snug truncate"
                style={{ color: "#1A1A2E" }}
              >
                {item.product.name}
              </p>
              {item.product.badge && (
                <span
                  className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                  style={{
                    backgroundColor: `${item.product.badgeColor ?? "#17409A"}20`,
                    color: item.product.badgeColor ?? "#17409A",
                  }}
                >
                  {item.product.badge}
                </span>
              )}
            </div>

            <p
              className="text-sm font-black shrink-0"
              style={{ color: "#17409A" }}
            >
              {fmt(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon */}
      {!couponApplied && (
        <div className="px-7 mb-4 shrink-0">
          <div
            className="flex gap-2 items-center rounded-2xl px-4 py-3"
            style={{
              backgroundColor: "#F4F7FF",
              border: "1.5px dashed #17409A40",
            }}
          >
            <IoGiftOutline
              className="text-base shrink-0"
              style={{ color: "#9CA3AF" }}
            />
            <input
              value={coupon}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
              placeholder="Mã giảm giá"
              className="flex-1 text-sm bg-transparent outline-none"
              style={{
                color: "#1A1A2E",
                fontFamily: "'Nunito', sans-serif",
              }}
            />
            {coupon.length > 0 && (
              <button
                onClick={onApplyCoupon}
                className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 shrink-0"
                style={{ backgroundColor: "#17409A", color: "white" }}
              >
                Áp dụng
              </button>
            )}
          </div>
        </div>
      )}

      {couponApplied && (
        <div
          className="mx-7 mb-4 px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0"
          style={{ backgroundColor: "rgba(78,205,196,0.12)" }}
        >
          <IoGiftOutline style={{ color: "#4ECDC4" }} />
          <p className="text-xs font-bold" style={{ color: "#4ECDC4" }}>
            Mã <b>{coupon}</b> — Giảm {fmt(50_000)}
          </p>
        </div>
      )}

      {/* Price breakdown */}
      <div
        className="px-7 pt-4 pb-6 shrink-0"
        style={{ borderTop: "1px solid #E5E7EB" }}
      >
        <div className="space-y-2.5 mb-4">
          {[
            ["Tạm tính", fmt(totalPrice)],
            [
              "Phí vận chuyển",
              shippingFee === 0 ? "Miễn phí" : fmt(shippingFee),
            ],
            ...(discount > 0 ? [["Giảm giá", `−${fmt(discount)}`]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-xs" style={{ color: "#6B7280" }}>
                {k}
              </span>
              <span
                className="text-xs font-bold"
                style={{
                  color: k === "Giảm giá" ? "#4ECDC4" : "#374151",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Paw divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
          <PawPrint color="#C4CAD9" size={14} />
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
        </div>

        <div className="flex justify-between items-end mb-1">
          <span className="text-sm font-bold" style={{ color: "#6B7280" }}>
            Tổng cộng
          </span>
          <span className="text-2xl font-black" style={{ color: "#17409A" }}>
            {fmt(finalTotal)}
          </span>
        </div>
        <p className="text-xs text-right" style={{ color: "#9CA3AF" }}>
          Đã bao gồm VAT
        </p>

        {/* Trust badges */}
        <div
          className="flex items-center gap-3 mt-5 pt-4"
          style={{ borderTop: "1px solid #F3F4F6" }}
        >
          {[
            { icon: IoShieldCheckmarkOutline, label: "An toàn" },
            { icon: IoLockClosedOutline, label: "Bảo mật" },
            { icon: IoGiftOutline, label: "Đổi trả 30 ngày" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1">
              <Icon className="text-[11px]" style={{ color: "#9CA3AF" }} />
              <span className="text-[10px]" style={{ color: "#9CA3AF" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
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

  /* ── Step transitions ── */
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

  /* ── Entrance animation ── */
  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.15 },
    );
  }, []);

  /* ── Empty cart redirect ── */
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
      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Mini nav header ── */}
        <header
          className="px-8 py-5 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid #E5E7EB" }}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: "#17409A" }}
            >
              <PawPrint color="white" size={18} />
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

        {/* ── Scrollable content ── */}
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

            {/* ── Navigation buttons ── */}
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

      {/* ══════════════ RIGHT PANEL — Order Summary ══════════════ */}
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

      {/* ══════════════ MOBILE: Bottom bar ══════════════ */}
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
