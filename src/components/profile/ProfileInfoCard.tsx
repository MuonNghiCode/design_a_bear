"use client";

import { useState, useEffect } from "react";
import { Provinces, Districts } from "vietnam-provinces-js";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoCheckmarkCircle,
  IoChevronDownOutline,
} from "react-icons/io5";
import type { User } from "@/contexts/AuthContext";

function normalizeLocationName(v: string): string {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(tinh|thanh pho|tp\.?|quan|huyen|thi xa|xa|phuong)\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function CompactSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <label className="text-[9px] font-black tracking-[0.2em] text-[#9CA3AF] uppercase mb-1.5 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 bg-[#F4F7FF] rounded-2xl px-4 py-3 text-left border-2 border-transparent focus:border-[#17409A]/30 transition-all duration-200 disabled:opacity-40 hover:border-[#17409A]/20 shadow-sm"
      >
        <span
          className={`text-xs font-bold truncate ${selected ? "text-[#1A1A2E]" : "text-[#9CA3AF]"}`}
        >
          {selected?.label ?? placeholder ?? "Chọn..."}
        </span>
        <IoChevronDownOutline
          className={`text-[#9CA3AF] shrink-0 transition-transform text-xs ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
          <div className="p-3 border-b border-[#F3F4F6]">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full bg-[#F4F7FF] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-all duration-200"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-[#9CA3AF] py-3 font-medium">
                Không tìm thấy
              </p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#F4F7FF] transition-all duration-150 ${
                    o.value === value
                      ? "text-[#17409A] bg-[#17409A]/5 font-black"
                      : "text-[#1A1A2E]"
                  }`}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export interface AddressForm {
  streetAddress: string;
  province: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
}

interface Props {
  user: User;
  editMode: boolean;
  name: string;
  phone: string;
  addressDisplay: string;
  addressForm: AddressForm;
  saving: boolean;
  saveMessage: string | null;
  saveError: string | null;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setAddressForm: (f: AddressForm) => void;
  onSave: () => void;
}

export default function ProfileInfoCard({
  user,
  editMode,
  name,
  phone,
  addressDisplay,
  addressForm,
  saving,
  saveMessage,
  saveError,
  setName,
  setPhone,
  setAddressForm,
  onSave,
}: Props) {
  const [provinces, setProvinces] = useState<
    { idProvince: string; name: string }[]
  >([]);
  const [districts, setDistricts] = useState<
    { idDistrict: string; name: string }[]
  >([]);
  const [communes, setCommunes] = useState<
    { idCommune: string; name: string }[]
  >([]);
  const [loadingD, setLoadingD] = useState(false);
  const [loadingC, setLoadingC] = useState(false);

  useEffect(() => {
    Provinces.getAllProvince().then(setProvinces);
  }, []);

  useEffect(() => {
    if (!addressForm.province) {
      setDistricts([]);
      setCommunes([]);
      return;
    }
    setLoadingD(true);
    Provinces.getDistrictsByProvinceId(addressForm.province)
      .then(setDistricts)
      .finally(() => setLoadingD(false));
  }, [addressForm.province]);

  useEffect(() => {
    if (!addressForm.district) {
      setCommunes([]);
      return;
    }
    setLoadingC(true);
    Districts.getCommunesByDistrictId(addressForm.district)
      .then(setCommunes)
      .finally(() => setLoadingC(false));
  }, [addressForm.district]);

  useEffect(() => {
    if (
      addressForm.province ||
      !addressForm.provinceName ||
      provinces.length === 0
    )
      return;
    const wanted = normalizeLocationName(addressForm.provinceName);
    const matched = provinces.find(
      (p) =>
        normalizeLocationName(p.name) === wanted ||
        normalizeLocationName(p.name).includes(wanted) ||
        wanted.includes(normalizeLocationName(p.name)),
    );
    if (!matched) return;
    setAddressForm({
      ...addressForm,
      province: matched.idProvince,
      provinceName: matched.name,
    });
  }, [addressForm.provinceName, provinces]);

  useEffect(() => {
    if (
      addressForm.district ||
      !addressForm.districtName ||
      districts.length === 0
    )
      return;
    const wanted = normalizeLocationName(addressForm.districtName);
    const matched = districts.find(
      (d) =>
        normalizeLocationName(d.name) === wanted ||
        normalizeLocationName(d.name).includes(wanted) ||
        wanted.includes(normalizeLocationName(d.name)),
    );
    if (!matched) return;
    setAddressForm({
      ...addressForm,
      district: matched.idDistrict,
      districtName: matched.name,
    });
  }, [addressForm.districtName, districts]);

  useEffect(() => {
    if (addressForm.ward || !addressForm.wardName || communes.length === 0)
      return;
    const wanted = normalizeLocationName(addressForm.wardName);
    const matched = communes.find(
      (c) =>
        normalizeLocationName(c.name) === wanted ||
        normalizeLocationName(c.name).includes(wanted) ||
        wanted.includes(normalizeLocationName(c.name)),
    );
    if (!matched) return;
    setAddressForm({
      ...addressForm,
      ward: matched.idCommune,
      wardName: matched.name,
    });
  }, [addressForm.wardName, communes]);

  const selectProvince = (id: string) => {
    const p = provinces.find((x) => x.idProvince === id);
    setAddressForm({
      ...addressForm,
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
    setAddressForm({
      ...addressForm,
      district: id,
      districtName: d?.name ?? "",
      ward: "",
      wardName: "",
    });
  };

  const selectWard = (id: string) => {
    const c = communes.find((x) => x.idCommune === id);
    setAddressForm({ ...addressForm, ward: id, wardName: c?.name ?? "" });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-50 relative overflow-hidden h-fit" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4F7FF] rounded-full opacity-30 translate-x-12 -translate-y-12 z-0 pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#9CA3AF]">
          Thông tin cá nhân
        </p>
        {editMode && (
          <span className="text-[9px] font-black text-[#17409A] bg-[#17409A]/8 px-2.5 py-1 rounded-full shadow-sm">
            Đang chỉnh sửa
          </span>
        )}
      </div>

      <div className="flex flex-col gap-5 relative z-10">
        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Họ và tên
          </label>
          {editMode ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors shadow-sm"
            />
          ) : (
            <div className="flex items-center gap-3 bg-[#F4F7FF]/30 p-3 rounded-2xl border border-[#F4F7FF]">
              <div className="w-9 h-9 rounded-xl bg-[#17409A]/5 text-[#17409A] flex items-center justify-center shrink-0">
                <IoPersonOutline className="text-base" />
              </div>
              <span className="text-[#1A1A2E] font-bold text-sm">{name}</span>
            </div>
          )}
        </div>

        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Email
          </label>
          <div className="flex items-center gap-3 bg-[#F4F7FF]/30 p-3 rounded-2xl border border-[#F4F7FF]">
            <div className="w-9 h-9 rounded-xl bg-[#17409A]/5 text-[#17409A] flex items-center justify-center shrink-0">
              <IoMailOutline className="text-base" />
            </div>
            <span className="text-[#1A1A2E] font-bold text-sm break-all flex-1">
              {user.email}
            </span>
            <IoCheckmarkCircle
              className="text-[#4ECDC4] text-xl shrink-0"
              title="Đã xác thực"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Số điện thoại
          </label>
          {editMode ? (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F4F7FF] rounded-2xl px-4 py-3 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors shadow-sm"
            />
          ) : (
            <div className="flex items-center gap-3 bg-[#F4F7FF]/30 p-3 rounded-2xl border border-[#F4F7FF]">
              <div className="w-9 h-9 rounded-xl bg-[#17409A]/5 text-[#17409A] flex items-center justify-center shrink-0">
                <IoCallOutline className="text-base" />
              </div>
              <span className="text-[#1A1A2E] font-bold text-sm">{phone}</span>
            </div>
          )}
        </div>

        <div>
          <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
            Địa chỉ
          </label>
          {editMode ? (
            <div className="flex flex-col gap-3">
              <CompactSelect
                label="Tỉnh / Thành phố"
                value={addressForm.province}
                onChange={selectProvince}
                options={provinces.map((p) => ({
                  value: p.idProvince,
                  label: p.name,
                }))}
                disabled={provinces.length === 0}
                placeholder={
                  provinces.length === 0 ? "Đang tải..." : "Chọn tỉnh/thành phố"
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <CompactSelect
                  label="Quận / Huyện"
                  value={addressForm.district}
                  onChange={selectDistrict}
                  options={districts.map((d) => ({
                    value: d.idDistrict,
                    label: d.name,
                  }))}
                  disabled={!addressForm.province || loadingD}
                  placeholder={loadingD ? "Đang tải..." : "Chọn quận/huyện"}
                />
                <CompactSelect
                  label="Phường / Xã"
                  value={addressForm.ward}
                  onChange={selectWard}
                  options={communes.map((c) => ({
                    value: c.idCommune,
                    label: c.name,
                  }))}
                  disabled={!addressForm.district || loadingC}
                  placeholder={loadingC ? "Đang tải..." : "Chọn phường/xã"}
                />
              </div>

              <div>
                <label className="text-[9px] font-black tracking-widest text-[#9CA3AF] uppercase mb-1.5 block">
                  Địa chỉ cụ thể
                </label>
                <div className="flex items-center gap-3 bg-[#F4F7FF] rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-[#17409A]/30 transition-all duration-200 shadow-sm">
                  <IoLocationOutline className="text-[#9CA3AF] text-lg shrink-0" />
                  <input
                    value={addressForm.streetAddress}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        streetAddress: e.target.value,
                      })
                    }
                    placeholder="Số nhà, tên đường..."
                    className="flex-1 bg-transparent outline-none text-xs font-bold text-[#1A1A2E] placeholder:text-[#9CA3AF] placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-[#F4F7FF]/30 p-3.5 rounded-2xl border border-[#F4F7FF]">
              <div className="w-9 h-9 rounded-xl bg-[#17409A]/5 text-[#17409A] flex items-center justify-center shrink-0 mt-0.5">
                <IoLocationOutline className="text-base" />
              </div>
              <span className="text-[#1A1A2E] font-bold text-sm leading-snug flex-1">
                {addressDisplay}
              </span>
            </div>
          )}
        </div>

        {editMode && (
          <button
            onClick={onSave}
            disabled={saving || !name.trim() || !phone.trim()}
            className="w-full bg-[#17409A] text-white font-black text-sm py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-all duration-300 shadow-xl shadow-[#17409A]/20 mt-2 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        )}

        {saveMessage && (
          <p className="text-xs font-semibold text-[#0F766E] bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl px-4 py-3 shadow-sm">
            {saveMessage}
          </p>
        )}

        {saveError && (
          <p className="text-xs font-semibold text-[#BE123C] bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl px-4 py-3 shadow-sm">
            {saveError}
          </p>
        )}
      </div>
    </div>
  );
}
