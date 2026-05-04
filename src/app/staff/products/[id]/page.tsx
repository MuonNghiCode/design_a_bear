"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { productService } from "@/services";
import ProductDetailsView from "@/components/admin/products/ProductDetailsView";
import type { ProductDetail } from "@/types";

export default function StaffProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProductById(id as string);
        if (res.isSuccess && res.value) {
          setProduct(res.value);
        } else {
          toast.error("Không tìm thấy sản phẩm");
          router.push("/staff/products");
        }
      } catch (err) {
        toast.error("Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-2xl border-4 border-[#17409A]/20 border-t-[#17409A] animate-spin" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <ProductDetailsView 
      product={product}
      onBack={() => router.back()}
      showActions={false}
    />
  );
}
