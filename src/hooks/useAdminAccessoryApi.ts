"use client";

import { useCallback, useState } from "react";
import { accessoryService } from "@/services/accessory.service";
import type {
  AccessoryResponse,
  CreateAccessoryRequest,
  UpdateAccessoryRequest,
} from "@/types";

export function useAdminAccessoryApi() {
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
      } else {
        console.error("Failed to fetch accessories", res.error);
        return null;
      }
    } catch (err) {
      console.error("Error fetching admin accessories", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccessory = useCallback(async (payload: CreateAccessoryRequest) => {
    setIsCreating(true);
    try {
      const res = await accessoryService.create(payload);
      if (res.isSuccess) {
        return true;
      } else {
        console.error("Failed to create accessory", res.error);
        return false;
      }
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
      const res = await accessoryService.update(id, payload);
      if (res.isSuccess) {
        return true;
      } else {
        console.error("Failed to update accessory", res.error);
        return false;
      }
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
      if (res.isSuccess) {
        return true;
      } else {
        console.error("Failed to delete accessory", res.error);
        return false;
      }
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
    accessories, 
    fetchAccessories, 
    createAccessory, 
    updateAccessory, 
    deleteAccessory 
  };
}
