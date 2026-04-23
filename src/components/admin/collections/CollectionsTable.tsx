"use client";

import React, { useEffect, useState } from "react";
import { collectionService } from "@/services";
import { CollectionResponse } from "@/types";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineRectangleStack,
  HiOutlineArrowPath,
  HiOutlineQueueList,
} from "react-icons/hi2";
import { useToast } from "@/contexts/ToastContext";
import CollectionModal from "./CollectionModal";
import CollectionProductModal from "./CollectionProductModal";

const CollectionsTable = () => {
  const { success, error: toastError } = useToast();
  const [collections, setCollections] = useState<CollectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<
    CollectionResponse | undefined
  >(undefined);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await collectionService.getCollections();
      if (res.isSuccess) {
        setCollections(res.value);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = () => {
    setSelectedCollection(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (collection: CollectionResponse) => {
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  const handleManageProducts = (collection: CollectionResponse) => {
    setSelectedCollection(collection);
    setIsProductModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bộ sưu tập này?")) return;
    try {
      const res = await collectionService.deleteCollection(id);
      if (res.isSuccess) {
        success("Xóa thành công!");
        fetchCollections();
      } else {
        toastError(res.error.description || "Lỗi khi xóa");
      }
    } catch (error) {
      toastError("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#E5E7EB]">
      <div className="p-8 border-b border-[#E5E7EB] flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">
            Danh sách bộ sưu tập
          </h2>
          <p className="text-[#6B7280]">
            Quản lý các nhóm sản phẩm theo chủ đề
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCollections}
            disabled={loading}
            className="flex items-center gap-2 bg-[#F4F7FF] text-[#17409A] text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#E5E7EB] transition-all whitespace-nowrap"
          >
            <HiOutlineArrowPath
              size={18}
              className={`${loading ? "animate-spin" : ""}`}
            />
            Làm mới đồng bộ
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#17409A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20"
          >
            <HiOutlinePlus size={20} />
            <span>Thêm mới</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F4F7FF]">
            <tr>
              <th className="px-8 py-5 text-[#17409A] font-bold uppercase text-xs tracking-wider">
                Tên bộ sưu tập
              </th>
              <th className="px-8 py-5 text-[#17409A] font-bold uppercase text-xs tracking-wider">
                Slug
              </th>
              <th className="px-8 py-5 text-[#17409A] font-bold uppercase text-xs tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="px-8 py-6 h-16 bg-gray-50/50" />
                </tr>
              ))
            ) : collections.length > 0 ? (
              collections.map((item) => (
                <tr
                  key={item.collectionId}
                  className="hover:bg-[#F4F7FF]/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#17409A]/10 flex items-center justify-center text-[#17409A]">
                        <HiOutlineRectangleStack size={20} />
                      </div>
                      <span className="font-bold text-[#1A1A2E]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[#6B7280] font-mono text-sm">
                    {item.slug}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleManageProducts(item)}
                        className="p-3 text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-xl transition-all"
                        title="Quản lý sản phẩm"
                      >
                        <HiOutlineQueueList size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-3 text-[#17409A] hover:bg-[#17409A] hover:text-white rounded-xl transition-all"
                        title="Chỉnh sửa"
                      >
                        <HiOutlinePencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.collectionId)}
                        className="p-3 text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white rounded-xl transition-all"
                        title="Xóa"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-8 py-20 text-center text-[#9CA3AF]"
                >
                  Chưa có bộ sưu tập nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCollections}
        collection={selectedCollection}
      />

      {isProductModalOpen && selectedCollection && (
        <CollectionProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          collection={selectedCollection}
        />
      )}
    </div>
  );
};

export default CollectionsTable;
