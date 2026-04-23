"use client";

import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { collectionService } from "@/services";
import { CollectionResponse } from "@/types";
import { useToast } from "@/contexts/ToastContext";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  collection?: CollectionResponse; // If provided, we are in Edit mode
}

const CollectionModal = ({
  isOpen,
  onClose,
  onSuccess,
  collection,
}: CollectionModalProps) => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const isEdit = !!collection;

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        slug: collection.slug,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
      });
    }
  }, [collection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (isEdit && collection) {
        res = await collectionService.updateCollection(collection.collectionId, formData);
      } else {
        res = await collectionService.createCollection(formData);
      }

      if (res.isSuccess) {
        success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
        onSuccess();
        onClose();
      } else {
        toastError(res.error.description || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      toastError("Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1A1A2E]">
            {isEdit ? "Chỉnh sửa bộ sưu tập" : "Thêm bộ sưu tập mới"}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Tên bộ sưu tập
            </label>
            <input
              type="text"
              required
              placeholder="VD: Bộ sưu tập Xuân 2026"
              value={formData.name}
              onChange={(e) => generateSlug(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#17409A]/20 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Đường dẫn (Slug)
            </label>
            <input
              type="text"
              required
              placeholder="vd-bo-suu-tap-xuan"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#17409A]/20 focus:bg-white rounded-2xl outline-none transition-all font-mono text-sm"
            />
            <p className="text-[10px] text-gray-400 ml-1 italic">
              * Tự động tạo từ tên nếu để trống hoặc thay đổi tên.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 bg-[#17409A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isEdit ? "Cập nhật" : "Tạo ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionModal;
