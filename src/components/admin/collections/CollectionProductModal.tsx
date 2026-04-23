"use client";

import React, { useState, useEffect } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { collectionService, productService } from "@/services";
import { CollectionResponse, ProductListItem } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import Image from "next/image";
import { HiOutlineTrash, HiOutlinePlus } from "react-icons/hi2";

interface CollectionProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionResponse;
}

const CollectionProductModal = ({
  isOpen,
  onClose,
  collection,
}: CollectionProductModalProps) => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentProducts, setCurrentProducts] = useState<ProductListItem[]>([]);
  const [allProducts, setAllProducts] = useState<ProductListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && collection) {
      fetchCollectionDetails();
      fetchAllProducts();
    }
  }, [isOpen, collection]);

  const fetchCollectionDetails = async () => {
    setLoading(true);
    try {
      const res = await collectionService.getCollectionById(collection.collectionId);
      if (res.isSuccess) {
        setCurrentProducts(res.value.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch collection details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await productService.getProducts({ pageSize: 100 });
      if (res.isSuccess) {
        setAllProducts(res.value.items);
      }
    } catch (error) {
      console.error("Failed to fetch all products:", error);
    }
  };

  const handleAddProduct = async (productId: string) => {
    setAddingId(productId);
    try {
      const res = await collectionService.addProductToCollection(collection.collectionId, productId);
      if (res.isSuccess) {
        success("Đã thêm sản phẩm vào bộ sưu tập");
        fetchCollectionDetails();
      } else {
        toastError(res.error.description || "Lỗi khi thêm");
      }
    } catch (error) {
      toastError("Lỗi hệ thống");
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await collectionService.removeProductFromCollection(collection.collectionId, productId);
      if (res.isSuccess) {
        success("Đã xóa sản phẩm khỏi bộ sưu tập");
        fetchCollectionDetails();
      } else {
        toastError(res.error.description || "Lỗi khi xóa");
      }
    } catch (error) {
      toastError("Lỗi hệ thống");
    } finally {
      setRemovingId(null);
    }
  };

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !currentProducts.some(cp => cp.productId === p.productId)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#1A1A2E]/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-[#1A1A2E]">
              Quản lý sản phẩm: {collection.name}
            </h3>
            <p className="text-sm text-gray-500 font-semibold italic mt-1">
              {currentProducts.length} sản phẩm hiện có
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Current Products */}
          <div className="w-full md:w-1/2 p-6 border-r border-gray-100 overflow-y-auto">
            <h4 className="text-sm font-black text-[#17409A] uppercase tracking-wider mb-4">
              Sản phẩm hiện có
            </h4>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="space-y-3">
                {currentProducts.map(p => (
                  <div key={p.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <Image 
                        src={p.imageUrl || "/teddy_bear.png"} 
                        alt={p.name} 
                        width={48} 
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A1A2E] truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">ID: {p.productId.slice(0, 8)}...</p>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(p.productId)}
                      disabled={removingId === p.productId}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      {removingId === p.productId ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiOutlineTrash size={18} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-sm font-semibold">Chưa có sản phẩm nào</p>
              </div>
            )}
          </div>

          {/* Add Products */}
          <div className="w-full md:w-1/2 p-6 bg-gray-50/50 overflow-y-auto">
            <h4 className="text-sm font-black text-[#17409A] uppercase tracking-wider mb-4">
              Thêm sản phẩm mới
            </h4>
            
            <div className="relative mb-4">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-transparent focus:border-[#17409A]/10 rounded-2xl outline-none text-sm font-semibold transition-all shadow-sm"
              />
            </div>

            <div className="space-y-3">
              {filteredProducts.slice(0, 20).map(p => (
                <div key={p.productId} className="flex items-center gap-3 p-3 bg-white rounded-2xl hover:shadow-md transition-all border border-transparent hover:border-[#17409A]/10">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                    <Image 
                      src={p.imageUrl || "/teddy_bear.png"} 
                      alt={p.name} 
                      width={48} 
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A1A2E] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#17409A] font-black">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</p>
                  </div>
                  <button
                    onClick={() => handleAddProduct(p.productId)}
                    disabled={addingId === p.productId}
                    className="p-2 bg-[#17409A]/5 text-[#17409A] hover:bg-[#17409A] hover:text-white rounded-lg transition-all"
                  >
                    {addingId === p.productId ? (
                      <div className="w-4 h-4 border-2 border-[#17409A] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HiOutlinePlus size={18} />
                    )}
                  </button>
                </div>
              ))}
              {filteredProducts.length === 0 && searchQuery && (
                <div className="py-10 text-center">
                  <p className="text-gray-400 text-sm font-semibold">Không tìm thấy sản phẩm phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionProductModal;
