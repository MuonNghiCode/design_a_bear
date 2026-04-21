"use client";

import { useState, useEffect, useCallback } from "react";
import { MdAdd, MdEdit, MdDelete, MdBusiness, MdLocationOn, MdRefresh } from "react-icons/md";
import { locationService } from "@/services";
import type { Location } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import LocationModal from "./LocationModal";

export default function LocationTab() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await locationService.getLocations();
      if (res.isSuccess && res.value) {
        setLocations(res.value);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách kho");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa kho "${name}"? Thao tác này có thể ảnh hưởng đến tồn kho.`)) {
      return;
    }

    try {
      const res = await locationService.deleteLocation(id);
      if (res.isSuccess) {
        toast.success("Đã xóa kho hàng");
        fetchLocations();
      } else {
        toast.error(res.error?.description || "Không thể xóa kho hàng");
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối đến máy chủ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-[#1A1A2E]">Danh sách Kho hàng</h3>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase">Tổng cộng {locations.length} vị trí</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLocations}
            className="p-3 rounded-2xl bg-[#F4F7FF] text-[#17409A] hover:bg-[#17409A] hover:text-white transition-all shadow-sm"
            title="Làm mới"
          >
            <MdRefresh className="text-xl" />
          </button>
          <button 
            onClick={() => {
              setSelectedLocation(undefined);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#17409A] text-white font-black text-sm shadow-lg shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all"
          >
            <MdAdd className="text-xl" />
            Thêm kho mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse space-y-4">
              <div className="h-6 w-32 bg-gray-100 rounded-lg" />
              <div className="h-10 w-full bg-gray-50 rounded-xl" />
              <div className="h-10 w-full bg-gray-50 rounded-xl" />
            </div>
          ))
        ) : locations.length > 0 ? (
          locations.map((loc) => (
            <div 
              key={loc.locationId}
              className="group bg-white p-6 rounded-3xl border border-white shadow-sm hover:shadow-xl hover:shadow-[#17409A]/5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decor */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F4F7FF] -mr-12 -mt-12 rounded-full group-hover:bg-[#17409A]/5 transition-colors" />
              
              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F7FF] text-[#17409A] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <MdBusiness />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${loc.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {loc.isActive ? "Hoạt động" : "Tạm dừng"}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-[#1A1A2E] text-lg group-hover:text-[#17409A] transition-colors">{loc.name}</h4>
                  <div className="flex items-start gap-2 mt-2 text-[#6B7280]">
                    <MdLocationOn className="text-lg shrink-0 mt-0.5" />
                    <p className="text-xs font-bold leading-relaxed line-clamp-2">
                      {loc.addressLine1}, {loc.city}, {loc.state}
                      {loc.country ? `, ${loc.country}` : ""}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F4F7FF] text-[#17409A] font-black text-xs hover:bg-[#17409A] hover:text-white transition-all outline-none"
                  >
                    <MdEdit className="text-base" />
                    Chỉnh sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(loc.locationId, loc.name)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all outline-none"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-4">
            <MdBusiness className="text-6xl text-gray-100" />
            <p className="font-bold text-gray-400">Chưa có kho hàng nào được tạo</p>
          </div>
        )}
      </div>

      {showModal && (
        <LocationModal 
          location={selectedLocation}
          onClose={() => setShowModal(false)}
          onSuccess={fetchLocations}
        />
      )}
    </div>
  );
}
