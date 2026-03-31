"use client";

import { useState, useEffect } from "react";
import { Provinces, Districts } from "vietnam-provinces-js";
import {
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoChatbubbleOutline,
  IoHomeOutline,
} from "react-icons/io5";
import type { DeliveryForm } from "./checkout.types";
import { deliverySchema } from "./checkout.config";
import { FormField, SelectField, SearchableSelectField } from "./checkout.fields";

function normalizeLocationName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(tinh|thanh pho|tp\.?|quan|huyen|thi xa|xa|phuong)\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function StepDelivery({
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
    if (form.province || !form.provinceName || provinces.length === 0) return;

    const wanted = normalizeLocationName(form.provinceName);
    const matched = provinces.find(
      (p) =>
        normalizeLocationName(p.name) === wanted ||
        normalizeLocationName(p.name).includes(wanted) ||
        wanted.includes(normalizeLocationName(p.name)),
    );

    if (!matched) return;

    onChange({
      ...form,
      province: matched.idProvince,
      provinceName: matched.name,
    });
  }, [form, provinces, onChange]);

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

  useEffect(() => {
    if (form.district || !form.districtName || districts.length === 0) return;

    const wanted = normalizeLocationName(form.districtName);
    const matched = districts.find(
      (d) =>
        normalizeLocationName(d.name) === wanted ||
        normalizeLocationName(d.name).includes(wanted) ||
        wanted.includes(normalizeLocationName(d.name)),
    );

    if (!matched) return;

    onChange({
      ...form,
      district: matched.idDistrict,
      districtName: matched.name,
    });
  }, [form, districts, onChange]);

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
    return result.error.issues.find((i) => i.path[0] === key)?.message;
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
    <div className="space-y-5 relative">
      {/* Watermark — visible tint behind the form */}
      <div
        className="absolute top-0 right-0 text-[150px] font-black leading-none select-none pointer-events-none"
        style={{
          color: "rgba(23,64,154,0.12)",
          fontFamily: "'Nunito', sans-serif",
          lineHeight: 1,
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

          <SearchableSelectField
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
            <SearchableSelectField
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
            <SearchableSelectField
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
