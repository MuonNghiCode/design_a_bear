"use client";

import { useCallback, useState } from "react";
import { accessoryService } from "@/services/accessory.service";
import { productService } from "@/services/product.service";
import type {
  GetProductsRequest,
  GetProductsResponseData,
  CreateProductRequest,
  UpdateProductRequest,
  AccessoryResponse,
  CreateAccessoryRequest,
  UpdateAccessoryRequest,
} from "@/types";

export function useAdminProductsApi() {
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [data, setData] = useState<GetProductsResponseData | null>(null);
  const [accessories, setAccessories] = useState<AccessoryResponse[]>([]);
  const [accessoriesLoading, setAccessoriesLoading] = useState(false);

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

  const fetchAccessories = useCallback(async () => {
    setAccessoriesLoading(true);
    try {
      const res = await accessoryService.getAll();
      if (res.isSuccess && res.value) {
        setAccessories(res.value);
        return res.value;
      }
      return [];
    } catch (err) {
      console.error("Error fetching accessories", err);
      return [];
    } finally {
      setAccessoriesLoading(false);
    }
  }, []);

  const createAccessory = useCallback(async (payload: CreateAccessoryRequest) => {
    setIsCreating(true);
    try {
      const res = await accessoryService.create(payload as any);
      return res.isSuccess;
    } catch (err) {
      console.error("Error creating accessory", err);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateAccessory = useCallback(async (id: string, payload: UpdateAccessoryRequest) => {
    setIsUpdating(true);
    try {
      const res = await accessoryService.update(id, payload as any);
      return res.isSuccess;
    } catch (err) {
      console.error("Error updating accessory", err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteAccessory = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await accessoryService.deleteAccessory(id);
      return res.isSuccess;
    } catch (err) {
      console.error("Error deleting accessory", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    loading,
    isCreating,
    isUpdating,
    isDeleting,
    data,
    accessories,
    accessoriesLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAccessories,
    createAccessory,
    updateAccessory,
    deleteAccessory,
  };
}
