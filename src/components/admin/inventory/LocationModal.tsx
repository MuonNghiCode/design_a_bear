"use client";

import { useState, useEffect } from "react";
import { MdClose, MdBusiness, MdLocationOn } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Provinces, Districts } from "vietnam-provinces-js";
import { SearchableSelectField } from "@/components/checkout/checkout.fields";
import { useToast } from "@/contexts/ToastContext";
import { locationService } from "@/services";
import type { Location } from "@/types";

interface Props {
  location?: Location;
  onClose: () => void;
  onSuccess: () => void;
}

function normalizeLocationName(value: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(
      /\btp\.?\b|\bthanh pho\b|\btinh\b|\bquan\b|\bhuyen\b|\bthi xa\b|\bphuong\b|\bxa\b/g,
      "",
    )
    .replace(/\bhcm\b/g, "ho chi minh")
    .replace(/\bhn\b/g, "ha noi")
    .replace(/\s+/g, " ")
    .trim();
}

export default function LocationModal({ location, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Warehouse",
    addressLine1: "",
    city: "", // This will be the Province Name
    cityId: "",
    state: "", // This will be the District Name
    stateId: "",
    postalCode: "",
    country: "Vietnam",
    isActive: true,
  });
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const isEdit = !!location;

  // Initial load
  useEffect(() => {
    Provinces.getAllProvince().then(setProvinces);
  }, []);

  // Fetch districts when city (province) changes
  useEffect(() => {
    if (!formData.cityId) {
      setDistricts([]);
      return;
    }
    setLoadingGeo(true);
    Provinces.getDistrictsByProvinceId(formData.cityId)
      .then(setDistricts)
      .finally(() => setLoadingGeo(false));
  }, [formData.cityId]);

  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        name: location.name ?? "",
        type: location.type ?? "Warehouse",
        addressLine1: location.addressLine1 ?? "",
        city: location.city ?? "",
        state: location.state ?? "",
        postalCode: location.postalCode ?? "",
        country: location.country ?? "Vietnam",
        isActive: !!location.isActive,
      }));
    }
  }, [location]);

  // Match existing city/state strings to IDs
  useEffect(() => {
    if (provinces.length > 0 && formData.city && !formData.cityId) {
      const wanted = normalizeLocationName(formData.city);
      // Try exact match first, then partial match
      const matched =
        provinces.find((p) => normalizeLocationName(p.name) === wanted) ||
        provinces.find(
          (p) =>
            normalizeLocationName(p.name).includes(wanted) ||
            wanted.includes(normalizeLocationName(p.name)),
        );

      if (matched) {
        setFormData((prev) => ({ ...prev, cityId: matched.idProvince }));
      }
    }
  }, [provinces, formData.city, formData.cityId]);

  useEffect(() => {
    if (districts.length > 0 && formData.state && !formData.stateId) {
      const wanted = normalizeLocationName(formData.state);
      // Try exact match first, then partial match
      const matched =
        districts.find((d) => normalizeLocationName(d.name) === wanted) ||
        districts.find(
          (d) =>
            normalizeLocationName(d.name).includes(wanted) ||
            wanted.includes(normalizeLocationName(d.name)),
        );

      if (matched) {
        setFormData((prev) => ({ ...prev, stateId: matched.idDistrict }));
      }
    }
  }, [districts, formData.state, formData.stateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.addressLine1.trim() ||
      !formData.city.trim() ||
      !formData.state.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Chuẩn bị dữ liệu cơ bản (chung cho cả Create và Update)
      const baseData = {
        name: formData.name.trim(),
        type: formData.type,
        addressLine1: formData.addressLine1.trim(),
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
      };

      let res;
      if (isEdit && location) {
        // 2. Với cập nhật: Gửi thêm ID và Trạng thái hoạt động
        res = await locationService.updateLocation(location.locationId, {
          ...baseData,
          locationId: location.locationId,
          isActive: formData.isActive,
        });
      } else {
        // 3. Với tạo mới: Chỉ gửi dữ liệu cơ bản
        res = await locationService.createLocation(baseData);
      }

      if (res.isSuccess) {
        toast.success(
          isEdit
            ? "Cập nhật kho hàng thành công"
            : "Tạo kho hàng mới thành công",
        );
        onSuccess();
        onClose();
      } else {
        toast.error(
          res.error?.description || "Thao tác thất bại. Vui lòng kiểm tra lại.",
        );
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra trong quá trình lưu dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#F4F7FF]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#17409A] text-white flex items-center justify-center">
              <MdBusiness className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A1A2E]">
                {isEdit ? "Chỉnh sửa kho hàng" : "Thêm kho hàng mới"}
              </h2>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                Quản lý danh mục vị trí
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-gray-600 transition-colors shadow-sm border border-gray-50"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
                Tên kho hàng *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Vd: Kho Quận 9"
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
                Loại kho *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all appearance-none"
              >
                <option value="Warehouse">Kho hàng</option>
                <option value="Store">Cửa hàng</option>
                <option value="Showroom">Phòng trưng bày</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
              Địa chỉ (Số nhà/Đường) *
            </label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) =>
                setFormData({ ...formData, addressLine1: e.target.value })
              }
              placeholder="Nhập địa chỉ chi tiết..."
              className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
            />
          </div>

          <div className="space-y-4">
            <SearchableSelectField
              icon={IoLocationOutline}
              label={
                provinces.length === 0
                  ? "Đang tải tỉnh thành..."
                  : "Tỉnh / Thành phố *"
              }
              value={formData.cityId}
              onChange={(id) => {
                const p = provinces.find((x) => x.idProvince === id);
                setFormData({
                  ...formData,
                  cityId: id,
                  city: p?.name ?? "",
                  stateId: "",
                  state: "",
                });
              }}
              options={provinces.map((p) => ({
                value: p.idProvince,
                label: p.name,
              }))}
              disabled={provinces.length === 0}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <SearchableSelectField
                icon={IoLocationOutline}
                label={loadingGeo ? "Đang tải..." : "Quận / Huyện (Bang) *"}
                value={formData.stateId}
                onChange={(id) => {
                  const d = districts.find((x) => x.idDistrict === id);
                  setFormData({
                    ...formData,
                    stateId: id,
                    state: d?.name ?? "",
                  });
                }}
                options={districts.map((d) => ({
                  value: d.idDistrict,
                  label: d.name,
                }))}
                disabled={!formData.cityId || loadingGeo}
                required
              />
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
                  Mã bưu chính
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  placeholder="Vd: 700000"
                  className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] tracking-wider uppercase">
                Quốc gia
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full bg-[#F4F7FF] text-sm font-bold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17409A]"></div>
            </label>
            <span className="text-sm font-bold text-[#1A1A2E]">
              Trạng thái hoạt động
            </span>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#17409A] text-white py-4 rounded-2xl text-sm font-black shadow-lg shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Đang lưu..."
              ) : (
                <>
                  <MdBusiness className="text-lg" />
                  {isEdit ? "Cập nhật thông tin" : "Tạo kho ngay"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
