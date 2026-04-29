"use client";

import { useCallback, useState } from "react";
import { accessoryService } from "@/services/accessory.service";
import type {
  AccessoryResponse,
  CreateAccessoryRequest,
  UpdateAccessoryRequest,
} from "@/types";

export function useAdminAccessoriesApi() {
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [accessories, setAccessories] = useState<AccessoryResponse[]>([]);

  const fetchAccessories = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
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

  const getAccessory = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await accessoryService.getById(id);
      if (res.isSuccess) return res.value;
      return null;
    } catch (err) {
      console.error("Error fetching accessory", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    isCreating,
    isUpdating,
    isDeleting,
    accessories,
    fetchAccessories,
    createAccessory,
    updateAccessory,
    deleteAccessory,
    getAccessory,
  };
}
