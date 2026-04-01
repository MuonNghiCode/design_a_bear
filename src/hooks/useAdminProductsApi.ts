"use client";

import { useCallback, useState } from "react";
import { productService } from "@/services/product.service";
import type {
  GetProductsRequest,
  GetProductsResponseData,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";

export function useAdminProductsApi() {
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [data, setData] = useState<GetProductsResponseData | null>(null);

  const fetchProducts = useCallback(async (params?: GetProductsRequest) => {
    setLoading(true);
    try {
      const res = await productService.getProducts(params);
      if (res.isSuccess) {
        setData(res.value as GetProductsResponseData);
        return res.value as GetProductsResponseData;
      } else {
        console.error("Failed to fetch products", res.error);
        return null;
      }
    } catch (err) {
      console.error("Error fetching admin products", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload: CreateProductRequest) => {
    setIsCreating(true);
    try {
      const res = await productService.createProduct(payload);
      if (res.isSuccess) {
        return true;
      } else {
        console.error("Failed to create product", res.error);
        return false;
      }
    } catch (err) {
      console.error("Error creating product", err);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await productService.deleteProduct(id);
      if (res.isSuccess) {
        return true;
      } else {
        console.error("Failed to delete product", res.error);
        return false;
      }
    } catch (err) {
      console.error("Error deleting product", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, payload: UpdateProductRequest) => {
    setIsUpdating(true);
    try {
      const res = await productService.updateProduct(id, payload);
      if (res.isSuccess) {
        return true;
      } else {
        console.error("Failed to update product", res.error);
        return false;
      }
    } catch (err) {
      console.error("Error updating product", err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { loading, isCreating, isUpdating, isDeleting, data, fetchProducts, createProduct, updateProduct, deleteProduct };
}
